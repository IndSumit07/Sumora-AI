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
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },
    selfDescription: {
      type: String,
      required: [true, "Self description is required"],
      trim: true,
      maxlength: [2000, "Self description cannot exceed 2000 characters"],
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
