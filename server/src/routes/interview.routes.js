import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  aiLimiter,
  apiLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllReportsController,
  generateResumePdfController,
  deleteReportController,
} from "../controllers/interview.controller.js";
import {
  uploadResumeController,
  startInterviewController,
  startPrepareController,
  answerInterviewController,
  endInterviewController,
  getLiveInterviewController,
  getAllLiveInterviewsController,
  deleteLiveInterviewController,
  analyzeQuestionController,
  fetchJobController,
  voiceAgentResponseController,
} from "../controllers/liveInterview.controller.js";

const interviewRouter = express.Router();

// ── AI-report endpoints ────────────────────────────────────────────────────────

// POST /api/interview/  — generate AI report (optional resume PDF)
interviewRouter.post(
  "/",
  aiLimiter,
  authMiddleware,
  upload.single("resume"),
  generateInterViewReportController,
);
// GET  /api/interview/reports             — list all reports for current user
interviewRouter.get(
  "/reports",
  apiLimiter,
  authMiddleware,
  getAllReportsController,
);
// GET  /api/interview/report/:interviewId — get single AI report by ID
interviewRouter.get(
  "/report/:interviewId",
  apiLimiter,
  authMiddleware,
  getInterviewReportByIdController,
);
// POST /api/interview/resume/pdf/:id      — generate tailored resume PDF
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  aiLimiter,
  authMiddleware,
  generateResumePdfController,
);

// ── Live interview endpoints ───────────────────────────────────────────────────

// POST /api/interview/upload-resume      — parse PDF → return extracted text
interviewRouter.post(
  "/upload-resume",
  apiLimiter,
  authMiddleware,
  upload.single("resume"),
  uploadResumeController,
);
// POST /api/interview/start              — create LiveInterview, return first question
interviewRouter.post(
  "/start",
  aiLimiter,
  authMiddleware,
  startInterviewController,
);
// POST /api/interview/prepare/start      — start standalone topic-focused prepare session
interviewRouter.post(
  "/prepare/start",
  aiLimiter,
  authMiddleware,
  startPrepareController,
);
// POST /api/interview/answer             — submit answer, return next question
interviewRouter.post(
  "/answer",
  apiLimiter,
  authMiddleware,
  answerInterviewController,
);
// POST /api/interview/end                — end interview, generate & return feedback
interviewRouter.post("/end", aiLimiter, authMiddleware, endInterviewController);
// GET  /api/interview/live               — list all live interviews for user (?mode=job|prepare)
// NOTE: registered BEFORE /live/:id to avoid route shadowing
interviewRouter.get(
  "/live",
  apiLimiter,
  authMiddleware,
  getAllLiveInterviewsController,
);
// GET  /api/interview/live/:interviewId  — get one LiveInterview by ID
interviewRouter.get(
  "/live/:interviewId",
  apiLimiter,
  authMiddleware,
  getLiveInterviewController,
);
// DELETE /api/interview/report/:interviewId — delete an AI report
interviewRouter.delete(
  "/report/:interviewId",
  apiLimiter,
  authMiddleware,
  deleteReportController,
);
// DELETE /api/interview/live/:interviewId   — delete a live interview
interviewRouter.delete(
  "/live/:interviewId",
  apiLimiter,
  authMiddleware,
  deleteLiveInterviewController,
);
// POST /api/interview/fetch-job         — scrape LinkedIn job URL → role + description
interviewRouter.post(
  "/fetch-job",
  apiLimiter,
  authMiddleware,
  fetchJobController,
);
// POST /api/interview/analyze-question   — AI teaching for a single question (walkthrough)
interviewRouter.post(
  "/analyze-question",
  aiLimiter,
  authMiddleware,
  analyzeQuestionController,
);
// POST /api/interview/voice-agent-response — Deepgram Voice Agent function call handler
interviewRouter.post(
  "/voice-agent-response",
  apiLimiter,
  authMiddleware,
  voiceAgentResponseController,
);

export default interviewRouter;
