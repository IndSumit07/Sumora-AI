/**
 * liveInterview.controller.js
 *
 * Controllers for the AI-powered live interview flow:
 *
 *   POST /api/interview/upload-resume       → extract text from PDF
 *   POST /api/interview/start               → spin up a LangChain session, get Q1
 *   POST /api/interview/prepare/start       → start standalone topic-prep session
 *   POST /api/interview/answer              → submit an answer, get next question
 *   POST /api/interview/end                 → finish & generate structured feedback
 *   GET  /api/interview/live                → list all live interviews for user
 *   GET  /api/interview/live/:id            → get one live interview
 *   POST /api/interview/tts                 → Sarvam AI text-to-speech proxy
 */

import mongoose from "mongoose";
import { PDFParse } from "pdf-parse";
import LiveInterview from "../models/liveInterview.model.js";
import User from "../models/user.model.js";
import {
  initInterview,
  initPrepareInterview,
  sendAnswer,
  recoverChain,
  cleanupChain,
  generateFeedback,
  analyzeQuestion,
} from "../services/interviewService.js";
import { resolveCompanyInterviewPrompt } from "../config/companyInterviewPrompts.js";

const COSTS = {
  LIVE_INTERVIEW: 20,
  PREPARE_INTERVIEW: 20,
};

const INTERVIEW_DURATION_MS = 30 * 60 * 1000;

// ── Helper: parse PDF buffer via pdf-parse ────────────────────────────────────

async function parsePdf(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return (result.text || "").trim().slice(0, 8000);
  } catch (err) {
    console.warn("PDF parse failed:", err.message);
    return "";
  }
}

function parseStoredFeedback(feedbackValue) {
  if (!feedbackValue) return null;
  if (typeof feedbackValue === "object") return feedbackValue;
  try {
    return JSON.parse(feedbackValue);
  } catch {
    return null;
  }
}

function isInterviewExpired(interview) {
  if (!interview?.createdAt) return false;
  const startedAt = new Date(interview.createdAt).getTime();
  if (!Number.isFinite(startedAt)) return false;
  return Date.now() - startedAt >= INTERVIEW_DURATION_MS;
}

async function completeInterview(interview, { skipFeedback = false } = {}) {
  let feedback = null;
  let overallScore = 0;

  if (!skipFeedback) {
    const hasUserAnswers = (interview.conversation || []).some((turn) =>
      Boolean(turn?.answer?.trim()),
    );

    if (!hasUserAnswers) {
      feedback = {
        technicalScore: 0,
        communicationScore: 0,
        strengths: ["No user response captured."],
        weaknesses: [
          "Interview ended without any spoken or typed user answer.",
        ],
        improvements: [
          "Provide at least one voice or text answer to generate meaningful analysis.",
        ],
      };
      overallScore = 0;
    } else {
      feedback = await generateFeedback(interview.conversation || []);
      overallScore = Math.round(
        feedback.technicalScore * 6 + feedback.communicationScore * 4,
      );
    }
  }

  interview.feedback = feedback ? JSON.stringify(feedback) : "";
  interview.score = overallScore;
  interview.status = "completed";
  await interview.save();

  cleanupChain(interview._id.toString());
  return { feedback, score: overallScore };
}

// ── 1. Upload & parse resume ──────────────────────────────────────────────────

/**
 * POST /api/interview/upload-resume
 * Field name: "resume" (PDF, max 3 MB via existing file.middleware.js).
 * Returns the extracted plain text — caller stores it locally.
 */
export async function uploadResumeController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded. Send a PDF under the "resume" field.',
      });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are accepted." });
    }

    const resumeText = await parsePdf(req.file.buffer);

    return res.status(200).json({ resumeText });
  } catch (error) {
    console.error("Upload resume error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 2. Start interview ────────────────────────────────────────────────────────

/**
 * POST /api/interview/start
 * Body: { role, jobDescription, resumeText }
 *
 * Creates a LiveInterview document, launches the LangChain chain, and returns
 * the first AI question. No session required.
 */
export async function startInterviewController(req, res) {
  try {
    const {
      resumeText = "",
      role,
      jobDescription,
      difficulty = "medium",
      companyProfile = { type: "preset", key: "general" },
    } = req.body;

    if (!role?.trim())
      return res.status(400).json({ message: "role is required." });
    if (!jobDescription?.trim())
      return res.status(400).json({ message: "jobDescription is required." });
    if (!resumeText?.trim())
      return res.status(400).json({ message: "resumeText is required." });

    const resolvedCompanyProfile =
      resolveCompanyInterviewPrompt(companyProfile);

    const user = await User.findById(req.user.id);
    if (!user || user.tokens < COSTS.LIVE_INTERVIEW) {
      return res
        .status(402)
        .json({ message: "Insufficient tokens to start a live interview." });
    }

    // Persist the interview document first so we have the _id for the chain key
    const interview = await LiveInterview.create({
      user: req.user.id,
      mode: "job",
      resumeText: resumeText.trim().slice(0, 8000),
      role: role.trim().slice(0, 150),
      jobDescription: jobDescription.trim().slice(0, 5000),
      companyKey: resolvedCompanyProfile.companyKey,
      companyName: resolvedCompanyProfile.companyName,
      companyWebsite: resolvedCompanyProfile.companyWebsite,
      companyPromptTitle: resolvedCompanyProfile.promptTitle,
      companyPromptDescription: resolvedCompanyProfile.promptText,
      difficulty: ["easy", "medium", "hard"].includes(difficulty)
        ? difficulty
        : "medium",
      conversation: [],
    });

    // Kick off LangChain and get the first question
    const firstQuestion = await initInterview(
      interview._id,
      interview.resumeText,
      interview.role,
      interview.jobDescription,
      interview.difficulty,
      {
        type: interview.companyKey === "custom" ? "custom" : "preset",
        key: interview.companyKey,
        name: interview.companyName,
        website: interview.companyWebsite,
        title: interview.companyPromptTitle,
        description: interview.companyPromptDescription,
      },
    );

    // Persist the first question to the conversation array
    interview.conversation.push({ question: firstQuestion, answer: "" });
    await interview.save();

    // Deduct tokens
    user.tokens -= COSTS.LIVE_INTERVIEW;
    await user.save();

    return res.status(201).json({
      interviewId: interview._id,
      question: firstQuestion,
      startedAt: interview.createdAt,
      endsAt: new Date(
        new Date(interview.createdAt).getTime() + INTERVIEW_DURATION_MS,
      ),
      durationSeconds: INTERVIEW_DURATION_MS / 1000,
      tokensLeft: user.tokens,
    });
  } catch (error) {
    console.error("Start interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 2b. Start prepare-mode interview ─────────────────────────────────────────

/**
 * POST /api/interview/prepare/start
 * Body: { subject, topic, resumeText? }
 *
 * Creates a standalone (no session) LiveInterview in prepare mode, launches
 * the topic-locked LangChain chain, and returns the first question.
 */
export async function startPrepareController(req, res) {
  try {
    const { subject, topic, resumeText = "", difficulty = "medium" } = req.body;

    if (!subject?.trim())
      return res.status(400).json({ message: "subject is required." });
    if (!topic?.trim())
      return res.status(400).json({ message: "topic is required." });

    const user = await User.findById(req.user.id);
    if (!user || user.tokens < COSTS.PREPARE_INTERVIEW) {
      return res
        .status(402)
        .json({ message: "Insufficient tokens for prepare mode." });
    }

    const interview = await LiveInterview.create({
      user: req.user.id,
      mode: "prepare",
      subject: subject.trim().slice(0, 100),
      topic: topic.trim().slice(0, 200),
      resumeText: resumeText.trim().slice(0, 8000),
      difficulty: ["easy", "medium", "hard"].includes(difficulty)
        ? difficulty
        : "medium",
      conversation: [],
    });

    const firstQuestion = await initPrepareInterview(
      interview._id,
      interview.subject,
      interview.topic,
      interview.resumeText,
      interview.difficulty,
    );

    interview.conversation.push({ question: firstQuestion, answer: "" });
    await interview.save();

    user.tokens -= COSTS.PREPARE_INTERVIEW;
    await user.save();

    return res.status(201).json({
      interviewId: interview._id,
      question: firstQuestion,
      startedAt: interview.createdAt,
      endsAt: new Date(
        new Date(interview.createdAt).getTime() + INTERVIEW_DURATION_MS,
      ),
      durationSeconds: INTERVIEW_DURATION_MS / 1000,
      tokensLeft: user.tokens,
    });
  } catch (error) {
    console.error("Start prepare interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 3. Submit answer, receive next question ───────────────────────────────────

/**
 * POST /api/interview/answer
 * Body: { interviewId, userAnswer }
 *
 * Saves the user's answer against the last open conversation turn, invokes the
 * LangChain chain, appends the new AI question, and returns it.
 */
export async function answerInterviewController(req, res) {
  try {
    const { interviewId, userAnswer } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });
    if (!userAnswer?.trim())
      return res.status(400).json({ message: "userAnswer is required." });

    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed")
      return res
        .status(400)
        .json({ message: "This interview has already ended." });

    if (isInterviewExpired(interview)) {
      const trimmedAnswer = userAnswer.trim();
      const lastIdx = interview.conversation.length - 1;
      if (
        trimmedAnswer &&
        lastIdx >= 0 &&
        !interview.conversation[lastIdx]?.answer?.trim()
      ) {
        interview.conversation[lastIdx].answer = trimmedAnswer;
      }

      const completed = await completeInterview(interview);
      return res.status(200).json({
        interviewEnded: true,
        timedOut: true,
        message:
          "Interview time limit reached. The interview was ended automatically.",
        ...completed,
      });
    }

    // Recover chain from DB if the server restarted and map was cleared
    try {
      await recoverChain(interview);
    } catch (_) {
      // Already in memory — ignore
    }

    // Write the answer to the last open turn
    const lastIdx = interview.conversation.length - 1;
    interview.conversation[lastIdx].answer = userAnswer.trim();

    // Get the AI's next question
    const nextQuestion = await sendAnswer(
      interview._id.toString(),
      userAnswer.trim(),
    );

    // Append the new question turn
    interview.conversation.push({ question: nextQuestion, answer: "" });
    await interview.save();

    return res.status(200).json({ question: nextQuestion });
  } catch (error) {
    console.error("Answer interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 4. End interview & generate feedback ─────────────────────────────────────

/**
 * POST /api/interview/end
 * Body: { interviewId }
 *
 * Generates structured feedback from the full conversation, persists it and
 * marks the interview as completed.
 */
export async function endInterviewController(req, res) {
  try {
    const { interviewId, skipFeedback = false, conversationTurns } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed") {
      return res.status(200).json({
        feedback: parseStoredFeedback(interview.feedback),
        score: interview.score || 0,
      });
    }

    // In interactive mode, client may send transcript turns at end.
    // Persist only user utterances as interview answers for scoring.
    if (Array.isArray(conversationTurns) && conversationTurns.length > 0) {
      const userAnswers = extractUserOnlyAnswers(conversationTurns);
      const normalizedConversation = applyUserAnswersToConversation(
        interview.conversation || [],
        userAnswers,
      );
      if (normalizedConversation.length > 0) {
        interview.conversation = normalizedConversation;
      }
    }

    const completed = await completeInterview(interview, { skipFeedback });
    return res.status(200).json(completed);
  } catch (error) {
    console.error("End interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 4b. Save user feedback after interview completion ────────────────────────

/**
 * POST /api/interview/feedback
 * Body: { interviewId, rating, comment? }
 *
 * Allows users to submit a star rating and optional comment after ending
 * a job or prepare interview.
 */
export async function submitInterviewFeedbackController(req, res) {
  try {
    const { interviewId, rating, comment = "" } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const parsedRating = Number(rating);
    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return res
        .status(400)
        .json({ message: "rating must be an integer between 1 and 5." });
    }

    const safeComment = (comment || "").toString().trim();
    if (safeComment.length > 1000) {
      return res
        .status(400)
        .json({ message: "comment must be at most 1000 characters." });
    }

    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    if (interview.status !== "completed") {
      return res.status(400).json({
        message: "You can submit feedback only after interview completion.",
      });
    }

    interview.userFeedback = {
      rating: parsedRating,
      comment: safeComment,
      submittedAt: new Date(),
    };

    await interview.save();

    return res.status(200).json({
      message: "Feedback submitted successfully.",
      userFeedback: interview.userFeedback,
    });
  } catch (error) {
    console.error("Submit interview feedback error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 5. Get one live interview ─────────────────────────────────────────────────

/**
 * GET /api/interview/live/:interviewId
 */
export async function getLiveInterviewController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    let parsedFeedback = null;
    if (interview.feedback) {
      try {
        parsedFeedback = JSON.parse(interview.feedback);
      } catch {
        /* raw string */
      }
    }

    return res.status(200).json({
      interview: {
        ...interview.toObject(),
        feedback: parsedFeedback ?? interview.feedback,
      },
    });
  } catch (error) {
    console.error("Get live interview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 6. List all live interviews for user ────────────────────────────────────

/**
 * GET /api/interview/live
 * Optional query: ?mode=job|prepare
 *
 * Returns summary rows for all live interviews belonging to the current user.
 */
export async function getAllLiveInterviewsController(req, res) {
  try {
    const query = { user: req.user.id };
    if (req.query.mode) query.mode = req.query.mode;

    const interviews = await LiveInterview.find(query, {
      _id: 1,
      mode: 1,
      role: 1,
      subject: 1,
      topic: 1,
      score: 1,
      status: 1,
      difficulty: 1,
      companyKey: 1,
      companyName: 1,
      createdAt: 1,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ interviews });
  } catch (error) {
    console.error("Get all live interviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 7. Delete a live interview ────────────────────────────────────────────────

/**
 * DELETE /api/interview/live/:interviewId
 * Deletes the document and cleans up its in-memory chain.
 */
export async function deleteLiveInterviewController(req, res) {
  try {
    const { interviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await LiveInterview.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    cleanupChain(interviewId);
    return res.status(200).json({ message: "Interview deleted." });
  } catch (error) {
    console.error("Delete live interview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 8. Analyze a single question (teaching walkthrough) ───────────────────────

/**
 * POST /api/interview/analyze-question
 * Body: { interviewId, questionIndex }
 *
 * For a completed interview, fetches the question + candidate answer at the
 * given index and asks the AI to teach the ideal answer.
 * Returns { teaching: { why, structure, sampleAnswer, tip } }
 */
// ── Helper: strip HTML tags and decode entities ───────────────────────────────

function stripHtml(str) {
  if (!str) return "";
  return str
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li>/gi, "\n• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractUserOnlyAnswers(turns = []) {
  if (!Array.isArray(turns)) return [];

  return turns
    .filter(
      (entry) => (entry?.role || "").toString().trim().toLowerCase() === "user",
    )
    .map((entry) => (entry?.text || "").toString().trim())
    .filter(Boolean);
}

function applyUserAnswersToConversation(
  baseConversation = [],
  userAnswers = [],
) {
  const normalizedBase = Array.isArray(baseConversation)
    ? baseConversation.map((turn) => ({
        question: (turn?.question || "").toString(),
        answer: "",
      }))
    : [];

  if (!userAnswers.length) return normalizedBase;

  let answerIndex = 0;

  for (
    let conversationIndex = 0;
    conversationIndex < normalizedBase.length &&
    answerIndex < userAnswers.length;
    conversationIndex += 1
  ) {
    normalizedBase[conversationIndex].answer = userAnswers[answerIndex];
    answerIndex += 1;
  }

  while (answerIndex < userAnswers.length) {
    normalizedBase.push({
      question: "Interviewer prompt",
      answer: userAnswers[answerIndex],
    });
    answerIndex += 1;
  }

  return normalizedBase;
}

// ── 9. Fetch job details from a LinkedIn URL ──────────────────────────────────

/**
 * POST /api/interview/fetch-job
 * Body: { url: string }
 * Returns: { role, company, jobDescription }
 *
 * Uses LinkedIn's public guest-jobs API (no login required):
 *   https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{jobId}
 */
export async function fetchJobController(req, res) {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "url is required." });
  }

  const trimmed = url.trim();

  if (!/linkedin\.com\/(jobs?|job-apply)\//i.test(trimmed)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid LinkedIn job URL." });
  }

  // Extract job ID — handles two URL formats:
  //   /jobs/view/4096789876  or  /jobs/view/title-4096789876/   (direct post)
  //   ?currentJobId=4358923910                                  (collections/search pages)
  let jobId = null;
  try {
    const { pathname, searchParams } = new URL(trimmed);
    // 1. Query param — collections, search, recommended pages
    jobId = searchParams.get("currentJobId") || null;
    // 2. Path segment fallback — /jobs/view/{id} pages
    if (!jobId) {
      const segments = pathname.split("/").filter(Boolean);
      for (let i = segments.length - 1; i >= 0; i--) {
        const m = segments[i].match(/(\d{7,})$/);
        if (m) {
          jobId = m[1];
          break;
        }
      }
    }
  } catch {
    return res.status(400).json({ message: "Invalid URL format." });
  }

  if (!jobId) {
    return res.status(400).json({
      message:
        "Could not find a job ID in this URL. Please paste the direct job posting link.",
    });
  }

  const guestUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(guestUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (response.status === 404) {
      return res.status(404).json({
        message: "Job posting not found. It may have been removed or expired.",
      });
    }
    if (!response.ok) {
      return res.status(422).json({
        message: "Could not fetch this job posting. Please fill in manually.",
      });
    }

    const html = await response.text();

    let role = "";
    let company = "";
    let jobDescription = "";

    // 1. Try JSON-LD (most structured)
    const jsonLdMatch = html.match(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
    );
    if (jsonLdMatch) {
      try {
        const data = JSON.parse(jsonLdMatch[1].trim());
        if (data.title) role = stripHtml(data.title);
        if (data.hiringOrganization?.name)
          company = stripHtml(data.hiringOrganization.name);
        if (data.description) jobDescription = stripHtml(data.description);
      } catch {
        // fall through to regex
      }
    }

    // 2. Regex fallbacks against the HTML fragment LinkedIn returns
    if (!role) {
      const m = html.match(
        /class="[^"]*(?:top-card-layout__title|topcard__title)[^"]*"[^>]*>\s*([\s\S]*?)\s*<\//i,
      );
      if (m) role = stripHtml(m[1]);
    }
    if (!company) {
      const m = html.match(
        /class="[^"]*topcard__org-name(?:-link)?[^"]*"[^>]*>\s*([\s\S]*?)\s*<\//i,
      );
      if (m) company = stripHtml(m[1]);
    }
    if (!jobDescription) {
      const m = html.match(
        /class="[^"]*(?:show-more-less-html__markup|description__text--rich)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      );
      if (m) jobDescription = stripHtml(m[1]);
    }

    if (!role && !jobDescription) {
      return res.status(422).json({
        message:
          "Could not extract job details from this posting. It may be private or expired.",
      });
    }

    return res.status(200).json({ role, company, jobDescription });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ message: "Request timed out. Please try again." });
    }
    console.error("fetchJob error:", err.message);
    return res.status(500).json({ message: "Failed to fetch job details." });
  }
}

export async function analyzeQuestionController(req, res) {
  try {
    const { interviewId, questionIndex } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });
    if (typeof questionIndex !== "number" || questionIndex < 0)
      return res
        .status(400)
        .json({ message: "questionIndex must be a non-negative number." });

    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    const turn = interview.conversation?.[questionIndex];
    if (!turn)
      return res.status(400).json({ message: "Question index out of range." });

    const context = {
      mode: interview.mode,
      role: interview.role,
      jobDescription: interview.jobDescription,
      subject: interview.subject,
      topic: interview.topic,
    };

    const teaching = await analyzeQuestion(
      turn.question,
      turn.answer || "",
      context,
    );

    return res.status(200).json({ teaching });
  } catch (error) {
    console.error("Analyze question error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 10. Voice Agent Response (for Deepgram Voice Agent) ───────────────────────

/**
 * POST /api/interview/voice-agent-response
 * Body: { userMessage: string, context: { interviewId, role, jobDescription, subject, topic, ... } }
 *
 * Called by Deepgram Voice Agent via function calling.
 * Returns the next AI response for the live voice conversation.
 */
export async function voiceAgentResponseController(req, res) {
  try {
    const { userMessage, context = {} } = req.body;

    if (!userMessage?.trim())
      return res.status(400).json({ message: "userMessage is required." });

    const { interviewId } = context;

    if (!interviewId)
      return res
        .status(400)
        .json({ message: "interviewId is required in context." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    // Find the interview
    const interview = await LiveInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    if (interview.status === "completed")
      return res
        .status(400)
        .json({ message: "This interview has already ended." });

    // Recover chain from DB if needed
    try {
      await recoverChain(interview);
    } catch (_) {
      // Already in memory
    }

    // Handle initial greeting
    if (userMessage === "[START]") {
      // Get the first question without saving an answer
      const firstQuestion = await sendAnswer(
        interview._id.toString(),
        "Hello, I'm ready to begin.",
      );
      return res.status(200).json({ response: firstQuestion });
    }

    // Get AI response
    const nextQuestion = await sendAnswer(
      interview._id.toString(),
      userMessage.trim(),
    );

    return res.status(200).json({ response: nextQuestion });
  } catch (error) {
    console.error("Voice agent response error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}
