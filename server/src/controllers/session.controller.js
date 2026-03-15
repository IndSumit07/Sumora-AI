import mongoose from "mongoose";
import Session from "../models/session.model.js";
import InterviewReport from "../models/interviewReport.model.js";

/**
 * POST /api/session/
 * JSON body: { title, jobTitle, jobDescription, selfDescription }
 */
export async function createSessionController(req, res) {
  try {
    const { title, jobTitle, jobDescription, selfDescription } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: "Title is required" });
    if (!jobTitle?.trim())
      return res.status(400).json({ message: "Job title is required" });
    if (!jobDescription?.trim())
      return res.status(400).json({ message: "Job description is required" });
    if (!selfDescription?.trim())
      return res.status(400).json({ message: "Self description is required" });

    if (title.trim().length > 100)
      return res.status(400).json({ message: "Title cannot exceed 100 characters" });
    if (jobTitle.trim().length > 100)
      return res.status(400).json({ message: "Job title cannot exceed 100 characters" });
    if (jobDescription.trim().length > 5000)
      return res.status(400).json({ message: "Job description cannot exceed 5000 characters" });
    if (selfDescription.trim().length > 2000)
      return res.status(400).json({ message: "Self description cannot exceed 2000 characters" });

    const session = await Session.create({
      user: req.user.id,
      title: title.trim(),
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      selfDescription: selfDescription.trim(),
    });

    return res.status(201).json({ message: "Session created", session });
  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/session/
 * Returns all sessions with latestReport summary + reportCount.
 */
export async function getAllSessionsController(req, res) {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 });

    const sessionsWithReports = await Promise.all(
      sessions.map(async (session) => {
        const [latestReport, reportCount] = await Promise.all([
          InterviewReport.findOne(
            { session: session._id, user: req.user.id },
            "matchScore title createdAt",
            { sort: { createdAt: -1 } },
          ),
          InterviewReport.countDocuments({ session: session._id, user: req.user.id }),
        ]);
        return {
          ...session.toObject(),
          latestReport: latestReport || null,
          reportCount,
        };
      }),
    );

    return res.status(200).json({ sessions: sessionsWithReports });
  } catch (error) {
    console.error("Get all sessions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/session/:sessionId
 * Returns session + all its reports (newest first).
 */
export async function getSessionByIdController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid session ID" });

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const reports = await InterviewReport.find(
      { session: sessionId, user: req.user.id },
      { __v: 0 },
    ).sort({ createdAt: -1 });

    return res.status(200).json({ session, reports });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /api/session/:sessionId
 * JSON body: any subset of { title, jobTitle, jobDescription, selfDescription }
 */
export async function updateSessionController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid session ID" });

    const { title, jobTitle, jobDescription, selfDescription } = req.body;
    const update = {};

    if (title !== undefined) {
      if (!title.trim())
        return res.status(400).json({ message: "Title cannot be empty" });
      if (title.trim().length > 100)
        return res.status(400).json({ message: "Title cannot exceed 100 characters" });
      update.title = title.trim();
    }
    if (jobTitle !== undefined) {
      if (!jobTitle.trim())
        return res.status(400).json({ message: "Job title cannot be empty" });
      if (jobTitle.trim().length > 100)
        return res.status(400).json({ message: "Job title cannot exceed 100 characters" });
      update.jobTitle = jobTitle.trim();
    }
    if (jobDescription !== undefined) {
      if (!jobDescription.trim())
        return res.status(400).json({ message: "Job description cannot be empty" });
      if (jobDescription.trim().length > 5000)
        return res.status(400).json({ message: "Job description cannot exceed 5000 characters" });
      update.jobDescription = jobDescription.trim();
    }
    if (selfDescription !== undefined) {
      if (!selfDescription.trim())
        return res.status(400).json({ message: "Self description cannot be empty" });
      if (selfDescription.trim().length > 2000)
        return res.status(400).json({ message: "Self description cannot exceed 2000 characters" });
      update.selfDescription = selfDescription.trim();
    }

    if (!Object.keys(update).length)
      return res.status(400).json({ message: "No fields to update" });

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user: req.user.id },
      { $set: update },
      { new: true },
    );
    if (!session) return res.status(404).json({ message: "Session not found" });

    return res.status(200).json({ message: "Session updated", session });
  } catch (error) {
    console.error("Update session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /api/session/:sessionId
 * Deletes session and ALL its reports.
 */
export async function deleteSessionController(req, res) {
  try {
    const { sessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid session ID" });

    const session = await Session.findOneAndDelete({ _id: sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    await InterviewReport.deleteMany({ session: sessionId, user: req.user.id });

    return res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
