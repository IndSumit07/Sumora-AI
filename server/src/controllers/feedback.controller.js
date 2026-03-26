import User from "../models/user.model.js";
import SiteFeedback from "../models/siteFeedback.model.js";

export async function submitSiteFeedbackController(req, res) {
  try {
    const { subject = "", message = "" } = req.body;

    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanSubject) {
      return res.status(400).json({ message: "subject is required." });
    }

    if (!cleanMessage) {
      return res.status(400).json({ message: "message is required." });
    }

    if (cleanSubject.length > 120) {
      return res
        .status(400)
        .json({ message: "subject must be at most 120 characters." });
    }

    if (cleanMessage.length > 1500) {
      return res
        .status(400)
        .json({ message: "message must be at most 1500 characters." });
    }

    const user = await User.findById(req.user.id).select("username email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const feedback = await SiteFeedback.create({
      user: user._id,
      name: user.username,
      email: user.email,
      subject: cleanSubject,
      message: cleanMessage,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully.",
      feedbackId: feedback._id,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
