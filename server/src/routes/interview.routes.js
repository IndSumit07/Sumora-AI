import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { aiLimiter, apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
  generateInterViewReportController,
  getInterviewReportByIdController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// POST /api/interview/                              — generate report; optional resume PDF upload
interviewRouter.post(
  "/",
  aiLimiter,
  authMiddleware,
  upload.single("resume"),
  generateInterViewReportController,
);
// GET  /api/interview/report/:interviewId           — get a single report by ID
interviewRouter.get(
  "/report/:interviewId",
  apiLimiter,
  authMiddleware,
  getInterviewReportByIdController,
);
// POST /api/interview/resume/pdf/:interviewReportId — generate & upload tailored resume PDF
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  aiLimiter,
  authMiddleware,
  generateResumePdfController,
);

export default interviewRouter;
