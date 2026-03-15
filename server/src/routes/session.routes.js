import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  createSessionController,
  getAllSessionsController,
  getSessionByIdController,
  updateSessionController,
  deleteSessionController,
} from "../controllers/session.controller.js";

const sessionRouter = express.Router();

// POST   /api/session/     — create session (JSON body)
sessionRouter.post("/", apiLimiter, authMiddleware, createSessionController);
// GET    /api/session/     — list all sessions with report summaries
sessionRouter.get("/", apiLimiter, authMiddleware, getAllSessionsController);
// GET    /api/session/:id  — get session + all its reports
sessionRouter.get("/:sessionId", apiLimiter, authMiddleware, getSessionByIdController);
// PATCH  /api/session/:id  — update session fields (JSON body)
sessionRouter.patch("/:sessionId", apiLimiter, authMiddleware, updateSessionController);
// DELETE /api/session/:id  — delete session and all its reports
sessionRouter.delete("/:sessionId", apiLimiter, authMiddleware, deleteSessionController);

export default sessionRouter;
