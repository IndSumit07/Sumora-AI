import mongoose from "mongoose";

const conversationTurnSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  },
  { _id: false },
);

const userFeedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 1000, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const liveInterviewSchema = new mongoose.Schema(
  {
    // "job" = session-based live interview, "prepare" = standalone topic drill
    mode: {
      type: String,
      enum: ["job", "prepare"],
      default: "job",
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText: { type: String, default: "" },
    // job-mode fields
    role: { type: String, default: "", trim: true, maxlength: 150 },
    jobDescription: { type: String, default: "", trim: true, maxlength: 5000 },
    // prepare-mode fields
    subject: { type: String, default: "", trim: true, maxlength: 100 },
    topic: { type: String, default: "", trim: true, maxlength: 200 },
    conversation: [conversationTurnSchema],
    feedback: { type: String, default: "" },
    userFeedback: { type: userFeedbackSchema, default: null },
    score: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true },
);

const LiveInterview = mongoose.model("LiveInterview", liveInterviewSchema);
export default LiveInterview;
