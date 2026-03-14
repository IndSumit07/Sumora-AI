import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [1000, "Job description cannot exceed 1000 characters"],
    },
    hasReport: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
