import mongoose from "mongoose";

const conversationTurnSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  },
  { _id: false },
);

const liveInterviewSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText: { type: String, default: "" },
    role: { type: String, required: true, trim: true, maxlength: 150 },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    conversation: [conversationTurnSchema],
    feedback: { type: String, default: "" },
    score: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true },
);

const LiveInterview = mongoose.model("LiveInterview", liveInterviewSchema);
export default LiveInterview;
