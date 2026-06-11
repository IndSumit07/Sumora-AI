import mongoose from "mongoose";
import CodingInterview from "../models/codingInterview.model.js";
import User from "../models/user.model.js";
import {
  initCodingInterview,
  sendCodeSubmission,
  sendMessage,
  generateFeedback,
  recoverChain,
  cleanupChain,
  getSupportedLanguages,
} from "../services/codingInterviewService.js";
import { CONFIG, parsePagination } from "../configs/app.config.js";
import {
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
  CACHE_KEYS,
  CACHE_TTL,
  invalidateUserCache,
} from "../services/redis.service.js";

const COSTS = {
  CODING_INTERVIEW: 35,
};

const INTERVIEW_DURATION_MS = 45 * 60 * 1000; // 45 minutes for coding

function isInterviewExpired(interview) {
  if (!interview?.createdAt) return false;
  const startedAt = new Date(interview.createdAt).getTime();
  if (!Number.isFinite(startedAt)) return false;
  return Date.now() - startedAt >= INTERVIEW_DURATION_MS;
}

function parseProblemResponse(text) {
  const problemMatch = text.match(/---PROBLEM---\s*([\s\S]*?)(?=---EXAMPLES---|$)/i);
  const examplesMatch = text.match(/---EXAMPLES---\s*([\s\S]*?)(?=---CONSTRAINTS---|$)/i);
  const constraintsMatch = text.match(/---CONSTRAINTS---\s*([\s\S]*?)(?=---STARTER_CODE---|$)/i);
  const starterCodeMatch = text.match(/---STARTER_CODE---\s*([\s\S]*?)$/i);

  return {
    problemStatement: problemMatch ? problemMatch[1].trim() : text,
    examples: examplesMatch ? examplesMatch[1].trim() : "",
    constraints: constraintsMatch ? constraintsMatch[1].trim() : "",
    starterCode: starterCodeMatch ? starterCodeMatch[1].trim() : "",
  };
}

// ── 1. Get supported languages ────────────────────────────────────────────────

export async function getLanguagesController(req, res) {
  try {
    const languages = getSupportedLanguages().map((key) => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
    }));
    return res.status(200).json({ languages });
  } catch (error) {
    console.error("Get languages error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 2. Start coding interview ─────────────────────────────────────────────────

export async function startCodingInterviewController(req, res) {
  try {
    const { difficulty = "medium", language = "python" } = req.body;

    if (!getSupportedLanguages().includes(language)) {
      return res.status(400).json({ message: "Unsupported programming language." });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.tokens < COSTS.CODING_INTERVIEW) {
      return res
        .status(402)
        .json({ message: "Insufficient tokens to start a coding interview." });
    }

    const interview = await CodingInterview.create({
      user: req.user.id,
      mode: "coding",
      language,
      difficulty: CONFIG.interview.DIFFICULTIES.includes(difficulty)
        ? difficulty
        : CONFIG.interview.DEFAULT_DIFFICULTY,
      conversation: [],
      codeSubmissions: [],
    });

    const firstResponse = await initCodingInterview(
      interview._id,
      interview.difficulty,
      interview.language,
    );

    const parsed = parseProblemResponse(firstResponse);

    interview.problemStatement = parsed.problemStatement.slice(0, CONFIG.limits.JOB_DESCRIPTION_MAX);
    interview.starterCode = parsed.starterCode.slice(0, 5000);

    interview.conversation.push({
      role: "agent",
      text: firstResponse,
    });
    await interview.save();

    user.tokens -= COSTS.CODING_INTERVIEW;
    await user.save();

    await invalidateUserCache(req.user.id);

    return res.status(201).json({
      interviewId: interview._id,
      problemStatement: parsed.problemStatement,
      examples: parsed.examples,
      constraints: parsed.constraints,
      starterCode: parsed.starterCode,
      language: interview.language,
      difficulty: interview.difficulty,
      startedAt: interview.createdAt,
      endsAt: new Date(
        new Date(interview.createdAt).getTime() + INTERVIEW_DURATION_MS,
      ),
      durationSeconds: INTERVIEW_DURATION_MS / 1000,
      tokensLeft: user.tokens,
    });
  } catch (error) {
    console.error("Start coding interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 3. Submit code ────────────────────────────────────────────────────────────

export async function submitCodeController(req, res) {
  try {
    const { interviewId, code } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });
    if (!code?.trim())
      return res.status(400).json({ message: "code is required." });

    const interview = await CodingInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed")
      return res.status(400).json({ message: "This interview has already ended." });

    if (isInterviewExpired(interview)) {
      const completed = await completeCodingInterview(interview);
      await cacheDel(CACHE_KEYS.interviewById(interviewId));
      await cacheDelPattern(`interviews:list:${req.user.id}:*`);
      return res.status(200).json({
        interviewEnded: true,
        timedOut: true,
        message: "Interview time limit reached. The interview was ended automatically.",
        ...completed,
      });
    }

    try {
      await recoverChain(interview, interview.difficulty, interview.language);
    } catch (_) {
      // Already in memory
    }

    const analysis = await sendCodeSubmission(
      interview._id.toString(),
      code.trim(),
      interview.language,
      interview.problemStatement,
    );

    interview.conversation.push({
      role: "user",
      text: `Submitted code in ${interview.language}`,
      codeSubmission: {
        language: interview.language,
        code: code.trim().slice(0, 10000),
      },
    });
    interview.conversation.push({
      role: "agent",
      text: analysis,
    });
    interview.codeSubmissions.push({
      language: interview.language,
      code: code.trim().slice(0, 10000),
    });
    await interview.save();

    return res.status(200).json({
      analysis,
      interviewId,
    });
  } catch (error) {
    console.error("Submit code error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 4. Send message (chat) ────────────────────────────────────────────────────

export async function sendMessageController(req, res) {
  try {
    const { interviewId, message } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });
    if (!message?.trim())
      return res.status(400).json({ message: "message is required." });

    const interview = await CodingInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed")
      return res.status(400).json({ message: "This interview has already ended." });

    if (isInterviewExpired(interview)) {
      const completed = await completeCodingInterview(interview);
      await cacheDel(CACHE_KEYS.interviewById(interviewId));
      await cacheDelPattern(`interviews:list:${req.user.id}:*`);
      return res.status(200).json({
        interviewEnded: true,
        timedOut: true,
        message: "Interview time limit reached.",
        ...completed,
      });
    }

    try {
      await recoverChain(interview, interview.difficulty, interview.language);
    } catch (_) {
      // Already in memory
    }

    const response = await sendMessage(
      interview._id.toString(),
      message.trim(),
    );

    interview.conversation.push({
      role: "user",
      text: message.trim(),
    });
    interview.conversation.push({
      role: "agent",
      text: response,
    });
    await interview.save();

    return res.status(200).json({
      response,
      interviewId,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

// ── 5. End coding interview ───────────────────────────────────────────────────

export async function endCodingInterviewController(req, res) {
  try {
    const { interviewId } = req.body;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await CodingInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed") {
      let parsedFeedback = null;
      try {
        parsedFeedback = JSON.parse(interview.feedback);
      } catch {
        /* raw string */
      }
      return res.status(200).json({
        feedback: parsedFeedback ?? interview.feedback,
        score: interview.score || 0,
      });
    }

    const completed = await completeCodingInterview(interview);

    await cacheDel(CACHE_KEYS.interviewById(interviewId));
    await cacheDelPattern(`interviews:list:${req.user.id}:*`);

    return res.status(200).json(completed);
  } catch (error) {
    console.error("End coding interview error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

async function completeCodingInterview(interview) {
  let feedback = null;
  let overallScore = 0;

  const codeSubmissions = interview.codeSubmissions || [];

  if (codeSubmissions.length === 0) {
    feedback = {
      technicalScore: 0,
      problemSolvingScore: 0,
      codeQualityScore: 0,
      complexityAnalysisScore: 0,
      strengths: ["No code submissions captured."],
      weaknesses: ["Interview ended without any code submission."],
      improvements: [
        "Submit at least one solution to generate meaningful analysis.",
      ],
      problemBreakdown: [],
      insufficientData: true,
      submittedCount: 0,
      overallScore: 0,
    };
    overallScore = 0;
  } else {
    feedback = await generateFeedback(
      interview.conversation || [],
      codeSubmissions,
    );
    overallScore = feedback?.overallScore || 0;
  }

  interview.feedback = feedback ? JSON.stringify(feedback) : "";
  interview.score = overallScore;
  interview.status = "completed";
  await interview.save();

  cleanupChain(interview._id.toString());
  return { feedback, score: overallScore };
}

// ── 6. Get one coding interview ───────────────────────────────────────────────

export async function getCodingInterviewController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const cacheKey = CACHE_KEYS.interviewById(interviewId);
    let result = await cacheGet(cacheKey);

    if (!result) {
      const interview = await CodingInterview.findOne({
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

      result = {
        interview: {
          ...interview.toObject(),
          feedback: parsedFeedback ?? interview.feedback,
        },
      };

      await cacheSet(cacheKey, result, CACHE_TTL.INTERVIEW);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get coding interview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 7. List all coding interviews ────────────────────────────────────────────

export async function getAllCodingInterviewsController(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const cacheKey = CACHE_KEYS.interviewsList(req.user.id, "coding", page, limit);

    let result = await cacheGet(cacheKey);

    if (!result) {
      const [interviews, total] = await Promise.all([
        CodingInterview.find(
          { user: req.user.id, mode: "coding" },
          {
            _id: 1,
            language: 1,
            difficulty: 1,
            score: 1,
            status: 1,
            problemStatement: 1,
            createdAt: 1,
          },
        )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        CodingInterview.countDocuments({ user: req.user.id, mode: "coding" }),
      ]);

      result = {
        interviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };

      await cacheSet(cacheKey, result, CACHE_TTL.INTERVIEWS_LIST);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get all coding interviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 8. Delete coding interview ────────────────────────────────────────────────

export async function deleteCodingInterviewController(req, res) {
  try {
    const { interviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await CodingInterview.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });

    cleanupChain(interviewId);

    await cacheDel(CACHE_KEYS.interviewById(interviewId));
    await cacheDelPattern(`interviews:list:${req.user.id}:*`);

    return res.status(200).json({ message: "Interview deleted." });
  } catch (error) {
    console.error("Delete coding interview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ── 9. Voice Agent Response (for Deepgram Voice Agent) ───────────────────────

/**
 * POST /api/interview/coding/voice-agent-response
 * Body: { userMessage: string, context: { interviewId, ... } }
 *
 * Called by Deepgram Voice Agent via function calling.
 * Returns the next AI response for the live voice conversation.
 */
export async function codingVoiceAgentResponseController(req, res) {
  try {
    const { userMessage, context = {} } = req.body;

    if (!userMessage?.trim())
      return res.status(400).json({ message: "userMessage is required." });

    const { interviewId } = context;

    if (!interviewId)
      return res.status(400).json({ message: "interviewId is required in context." });
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interviewId." });

    const interview = await CodingInterview.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed")
      return res.status(400).json({ message: "This interview has already ended." });

    try {
      await recoverChain(interview, interview.difficulty, interview.language);
    } catch (_) {
      // Already in memory
    }

    let response;
    const trimmedMessage = userMessage.trim();

    // Handle initial voice activation — return warm welcome that references
    // the already-generated problem so voice and text stay in sync.
    if (trimmedMessage === "[START]") {
      const existingProblem = interview.problemStatement || "";
      const lang = interview.language || "Python";
      if (existingProblem) {
        response = `Hello... and welcome to your coding interview in ${lang}. I have already presented your first problem on the screen. Please take your time to read it carefully... and feel free to ask questions or discuss your approach. Let me know when you are ready to share your thoughts.`;
      } else {
        response = await sendMessage(
          interview._id.toString(),
          "Please present the first coding problem.",
        );
      }
    } else {
      response = await sendMessage(
        interview._id.toString(),
        trimmedMessage,
      );
    }

    interview.conversation.push({
      role: "user",
      text: trimmedMessage,
    });
    interview.conversation.push({
      role: "agent",
      text: response,
    });
    await interview.save();

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Coding voice agent response error:", error);
    return res.status(500).json({ message: error?.message || "Internal server error" });
  }
}
