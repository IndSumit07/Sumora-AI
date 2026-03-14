import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  createSessionController,
  getAllSessionsController,
  getSessionByIdController,
  deleteSessionController,
  updateSessionController,
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

/**
 * @route PATCH /api/session/:sessionId
 * @description Update session title or job description
 * @access private
 */
sessionRouter.patch(
  "/:sessionId",
  apiLimiter,
  authMiddleware,
  updateSessionController,
);

/**
 * @route DELETE /api/session/:sessionId
 * @description Delete a session and its report
 * @access private
 */
sessionRouter.delete(
  "/:sessionId",
  apiLimiter,
  authMiddleware,
  deleteSessionController,
);

export default sessionRouter;
