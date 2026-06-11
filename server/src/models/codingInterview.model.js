import mongoose from "mongoose";

const codeSubmissionSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    code: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conversationTurnSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["agent", "user"], required: true },
    text: { type: String, required: true },
    codeSubmission: codeSubmissionSchema,
  },
  { _id: false },
);

const codingInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ["coding"],
      default: "coding",
    },
    language: { type: String, default: "python", trim: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    problemStatement: { type: String, default: "" },
    starterCode: { type: String, default: "" },
    conversation: [conversationTurnSchema],
    feedback: { type: String, default: "" },
    score: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    codeSubmissions: [codeSubmissionSchema],
  },
  { timestamps: true },
);

const CodingInterview = mongoose.model("CodingInterview", codingInterviewSchema);
export default CodingInterview;
