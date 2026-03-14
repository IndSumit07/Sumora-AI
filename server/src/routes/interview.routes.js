import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { aiLimiter, apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report. Accepts multipart/form-data (PDF upload)
 *              or JSON body. Resume field can be a PDF file or plain text.
 * @access private
 */
interviewRouter.post(
  "/",
  aiLimiter,
  authMiddleware,
  upload.single("resume"),
  generateInterViewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  apiLimiter,
  authMiddleware,
  getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get(
  "/",
  apiLimiter,
  authMiddleware,
  getAllInterviewReportsController,
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf from a saved interview report.
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  aiLimiter,
  authMiddleware,
  generateResumePdfController,
);

export default interviewRouter;
