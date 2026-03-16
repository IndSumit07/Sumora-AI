/**
 * liveInterview.controller.js
 *
 * Controllers for the AI-powered live interview flow:
 *
 *   POST /api/interview/upload-resume       → extract text from PDF
 *   POST /api/interview/start               → spin up a LangChain session, get Q1
 *   POST /api/interview/answer              → submit an answer, get next question
 *   POST /api/interview/end                 → finish & generate structured feedback
 *   GET  /api/interview/live/session/:id    → list live interviews for a session
 *   GET  /api/interview/live/:id            → get one live interview
 */

import { createRequire } from "module";
import mongoose from "mongoose";
import LiveInterview from "../models/liveInterview.model.js";
import Session from "../models/session.model.js";
import {
  initInterview,
  initPrepareInterview,
  sendAnswer,
  recoverChain,
  cleanupChain,
  generateFeedback,
} from "../services/interviewService.js";

const _require = createRequire(import.meta.url);

// ── Helper: parse PDF buffer via pdf-parse ────────────────────────────────────

async function parsePdf(buffer) {
  try {
    const mod = _require("pdf-parse");
    const pdfParse = typeof mod === "function" ? mod : mod.default || mod;
    const result = await pdfParse(buffer);
    return (result.text || "").trim().slice(0, 8000);
  } catch (err) {
    console.warn("PDF parse failed:", err.message);
    return "";
  }
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
      return res
        .status(400)
        .json({
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
 * Body: { sessionId, resumeText?, role, jobDescription }
 *
 * Creates a LiveInterview document, launches the LangChain chain, and returns
 * the first AI question.
 */
export async function startInterviewController(req, res) {
  try {
    const { sessionId, resumeText = "", role, jobDescription } = req.body;

    if (!sessionId)
      return res.status(400).json({ message: "sessionId is required." });
    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid sessionId." });
    if (!role?.trim())
      return res.status(400).json({ message: "role is required." });
    if (!jobDescription?.trim())
      return res.status(400).json({ message: "jobDescription is required." });

    // Verify the session exists and belongs to this user
    const session = await Session.findOne({
      _id: sessionId,
      user: req.user.id,
    });
    if (!session)
      return res.status(404).json({ message: "Session not found." });

    // Persist the interview document first so we have the _id for the chain key
    const interview = await LiveInterview.create({
      session: session._id,
      user: req.user.id,
      resumeText: resumeText.trim().slice(0, 8000),
      role: role.trim(),
      jobDescription: jobDescription.trim(),
      conversation: [],
    });

    // Kick off LangChain and get the first question
    const firstQuestion = await initInterview(
      interview._id,
      interview.resumeText,
      interview.role,
      interview.jobDescription,
    );

    // Persist the first question to the conversation array
    interview.conversation.push({ question: firstQuestion, answer: "" });
    await interview.save();

    return res.status(201).json({
      interviewId: interview._id,
      question: firstQuestion,
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
    const { subject, topic, resumeText = "" } = req.body;

    if (!subject?.trim())
      return res.status(400).json({ message: "subject is required." });
    if (!topic?.trim())
      return res.status(400).json({ message: "topic is required." });

    const interview = await LiveInterview.create({
      user: req.user.id,
      mode: "prepare",
      subject: subject.trim().slice(0, 100),
      topic: topic.trim().slice(0, 200),
      resumeText: resumeText.trim().slice(0, 8000),
      conversation: [],
    });

    const firstQuestion = await initPrepareInterview(
      interview._id,
      interview.subject,
      interview.topic,
      interview.resumeText,
    );

    interview.conversation.push({ question: firstQuestion, answer: "" });
    await interview.save();

    return res.status(201).json({
      interviewId: interview._id,
      question: firstQuestion,
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
    const { interviewId } = req.body;

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
    if (interview.status === "completed")
      return res
        .status(400)
        .json({ message: "This interview was already ended." });

    // Generate structured feedback from the stored conversation
    const feedback = await generateFeedback(interview.conversation);

    // Weighted composite score (tech 60%, communication 40%), scaled to 0-100
    const overallScore = Math.round(
      feedback.technicalScore * 6 + feedback.communicationScore * 4,
    );

    // Persist
    interview.feedback = JSON.stringify(feedback);
    interview.score = overallScore;
    interview.status = "completed";
    await interview.save();

    // Clean up the in-memory chain
    cleanupChain(interviewId);

    return res.status(200).json({ feedback, score: overallScore });
  } catch (error) {
    console.error("End interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
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

// ── 6. List live interviews for a session ────────────────────────────────────

/**
 * GET /api/interview/live/session/:sessionId
 */
export async function getLiveInterviewsBySessionController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid sessionId." });

    const interviews = await LiveInterview.find(
      { session: sessionId, user: req.user.id },
      { conversation: 0, resumeText: 0, feedback: 0 },
    ).sort({ createdAt: -1 });

    return res.status(200).json({ interviews });
  } catch (error) {
    console.error("Get live interviews by session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
