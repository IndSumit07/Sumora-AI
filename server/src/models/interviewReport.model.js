import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    feedback: { type: String, default: "" },
  },
  { _id: false },
);

const atsIssueSchema = new mongoose.Schema(
  {
    issue: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    fix: { type: String, default: "" },
  },
  { _id: false },
);

const keywordEntrySchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    relevance: { type: String, enum: ["high", "medium", "low"], required: true },
  },
  { _id: false },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    recommendation: { type: String, default: "" },
    learningResources: [{ type: String }],
  },
  { _id: false },
);

const preparationPhaseSchema = new mongoose.Schema(
  {
    phase: { type: Number, required: true },
    focus: { type: String, required: true },
    duration: { type: String, default: "" },
    tasks: [{ type: String }],
    milestones: [{ type: String }],
  },
  { _id: false },
);

const atsSuggestionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    original: { type: String, default: "" },
    improved: { type: String, default: "" },
    reason: { type: String, default: "" },
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
    role: { type: String, default: "", trim: true, maxlength: 150 },
    jobDescription: { type: String, default: "", trim: true, maxlength: 5000 },
    selfDescription: { type: String, default: "", trim: true, maxlength: 2000 },
    title: { type: String, trim: true },
    matchScore: { type: Number, min: 0, max: 100 },

    sectionScores: [sectionScoreSchema],
    atsCompatibility: {
      overallScore: { type: Number, min: 0, max: 100 },
      issues: [atsIssueSchema],
      readability: { type: Number, min: 0, max: 100 },
      keywordDensity: { type: String, default: "" },
    },
    keywordAnalysis: {
      matchedKeywords: [keywordEntrySchema],
      missingKeywords: [keywordEntrySchema],
      overusedKeywords: [{ type: String }],
    },
    contentQuality: {
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      actionVerbScore: { type: Number, min: 0, max: 100 },
      quantifiableScore: { type: Number, min: 0, max: 100 },
      redundancyFlags: [{ type: String }],
      overallAssessment: { type: String, default: "" },
    },
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPhaseSchema],
    atsResumeSuggestions: [atsSuggestionSchema],
    roleMatch: {
      fittingRoles: [
        {
          title: String,
          matchPercentage: { type: Number, min: 0, max: 100 },
        },
      ],
      careerPath: { type: String, default: "" },
      levelAssessment: { type: String, default: "" },
    },

    resumePdfUrl: {
      type: String,
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
