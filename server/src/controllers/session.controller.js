import mongoose from "mongoose";
import Session from "../models/session.model.js";
import InterviewReport from "../models/interviewReport.model.js";

/**
 * POST /api/session/
 */
export async function createSessionController(req, res) {
  try {
    const { title, jobDescription } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }
    if (title.trim().length > 100) {
      return res
        .status(400)
        .json({ message: "Title cannot exceed 100 characters" });
    }
    if (jobDescription.trim().length > 1000) {
      return res
        .status(400)
        .json({ message: "Job description cannot exceed 1000 characters" });
    }

    const session = await Session.create({
      user: req.user.id,
      title: title.trim(),
      jobDescription: jobDescription.trim(),
    });

    return res.status(201).json({ message: "Session created", session });
  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/session/
 */
export async function getAllSessionsController(req, res) {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const sessionsWithReports = await Promise.all(
      sessions.map(async (session) => {
        const report = await InterviewReport.findOne(
          { session: session._id, user: req.user.id },
          "matchScore title createdAt",
        );
        return { ...session.toObject(), report: report || null };
      }),
    );

    return res.status(200).json({ sessions: sessionsWithReports });
  } catch (error) {
    console.error("Get all sessions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /api/session/:sessionId
 */
export async function deleteSessionController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findOneAndDelete({
      _id: sessionId,
      user: req.user.id,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await InterviewReport.deleteOne({ session: sessionId, user: req.user.id });

    return res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /api/session/:sessionId
 */
export async function updateSessionController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const { title, jobDescription } = req.body;
    const update = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      if (title.trim().length > 100) {
        return res
          .status(400)
          .json({ message: "Title cannot exceed 100 characters" });
      }
      update.title = title.trim();
    }

    if (jobDescription !== undefined) {
      if (!jobDescription.trim()) {
        return res
          .status(400)
          .json({ message: "Job description cannot be empty" });
      }
      if (jobDescription.trim().length > 1000) {
        return res
          .status(400)
          .json({ message: "Job description cannot exceed 1000 characters" });
      }
      update.jobDescription = jobDescription.trim();
    }

    if (!Object.keys(update).length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user: req.user.id },
      { $set: update },
      { new: true },
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ message: "Session updated", session });
  } catch (error) {
    console.error("Update session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/session/:sessionId
 */
export async function getSessionByIdController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findOne({
      _id: sessionId,
      user: req.user.id,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const report = await InterviewReport.findOne({
      session: sessionId,
      user: req.user.id,
    });

    return res.status(200).json({ session, report: report || null });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
