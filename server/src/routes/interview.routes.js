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
  generateResumePdfController,
} from "../controllers/interview.controller.js";
import {
  uploadResumeController,
  startInterviewController,
  answerInterviewController,
  endInterviewController,
  getLiveInterviewController,
  getLiveInterviewsBySessionController,
} from "../controllers/liveInterview.controller.js";

const interviewRouter = express.Router();

// ── Existing AI-report endpoints ──────────────────────────────────────────────

// POST /api/interview/                              — generate AI report (optional resume PDF)
interviewRouter.post(
  "/",
  aiLimiter,
  authMiddleware,
  upload.single("resume"),
  generateInterViewReportController,
);
// GET  /api/interview/report/:interviewId           — get single AI report by ID
interviewRouter.get(
  "/report/:interviewId",
  apiLimiter,
  authMiddleware,
  getInterviewReportByIdController,
);
// POST /api/interview/resume/pdf/:interviewReportId — generate tailored resume PDF
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
// POST /api/interview/answer             — submit answer, return next question
interviewRouter.post(
  "/answer",
  apiLimiter,
  authMiddleware,
  answerInterviewController,
);
// POST /api/interview/end                — end interview, generate & return feedback
interviewRouter.post("/end", aiLimiter, authMiddleware, endInterviewController);
// GET  /api/interview/live/session/:sessionId       — list all LiveInterviews for a session
interviewRouter.get(
  "/live/session/:sessionId",
  apiLimiter,
  authMiddleware,
  getLiveInterviewsBySessionController,
);
// GET  /api/interview/live/:interviewId             — get one LiveInterview by ID
interviewRouter.get(
  "/live/:interviewId",
  apiLimiter,
  authMiddleware,
  getLiveInterviewController,
);

export default interviewRouter;
