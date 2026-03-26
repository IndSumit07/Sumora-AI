import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import { submitSiteFeedbackController } from "../controllers/feedback.controller.js";

const feedbackRouter = express.Router();

// POST /api/feedback — submit product/site feedback (logged-in users)
feedbackRouter.post(
  "/",
  apiLimiter,
  authMiddleware,
  submitSiteFeedbackController,
);

export default feedbackRouter;
