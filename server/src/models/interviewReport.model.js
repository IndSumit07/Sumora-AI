import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "Question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { _id: false },
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: { type: String, required: [true, "Skill is required"] },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: [true, "Day is required"] },
    focus: { type: String, required: [true, "Focus is required"] },
    tasks: [{ type: String, required: [true, "Task is required"] }],
  },
  { _id: false },
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
      index: true,
    },
    // Direct context fields (stored with report, no session needed)
    role: { type: String, default: "", trim: true, maxlength: 150 },
    jobDescription: { type: String, default: "", trim: true, maxlength: 5000 },
    selfDescription: { type: String, default: "", trim: true, maxlength: 2000 },
    title: { type: String, trim: true }, // AI-derived job title label
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    resumePdfUrl: {
      type: String, // Cloudinary URL for the AI-generated resume PDF
      default: null,
    },
  },
  { timestamps: true },
);

const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);
export default InterviewReport;
