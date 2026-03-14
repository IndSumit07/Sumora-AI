import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  createSessionController,
  getAllSessionsController,
  getSessionByIdController,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

/**
 * @route POST /api/session/
 * @description Create a new interview prep session
 * @access private
 */
sessionRouter.post("/", apiLimiter, authMiddleware, createSessionController);

/**
 * @route GET /api/session/
 * @description Get all sessions for logged-in user (with report summaries)
 * @access private
 */
sessionRouter.get("/", apiLimiter, authMiddleware, getAllSessionsController);

/**
 * @route GET /api/session/:sessionId
 * @description Get a single session with its full report (if any)
 * @access private
 */
sessionRouter.get(
  "/:sessionId",
  apiLimiter,
  authMiddleware,
  getSessionByIdController,
);

export default sessionRouter;
