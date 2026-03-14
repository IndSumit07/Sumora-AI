import mongoose from "mongoose";
import { createRequire } from "module";
import InterviewReport from "../models/interviewReport.model.js";
import Session from "../models/session.model.js";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";

const _require = createRequire(import.meta.url);

/**
 * POST /api/interview/
 * Accepts multipart/form-data with sessionId + optional resume PDF/text + selfDescription.
 */
export async function generateInterViewReportController(req, res) {
  try {
    const { sessionId, selfDescription } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    if (selfDescription && selfDescription.length > 2000) {
      return res.status(400).json({ message: "Self description cannot exceed 2000 characters" });
    }

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.hasReport) {
      return res.status(409).json({ message: "Report already exists for this session" });
    }

    // Resolve resume text: uploaded PDF takes priority over pasted text
    let resumeText = req.body.resume || "";
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files are supported" });
      }
      // pdf-parse v2 uses a class-based API: new PDFParse({ data }) + .getText()
      const { PDFParse } = _require("pdf-parse");
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      resumeText = (result.text || "").trim().slice(0, 8000);
    } else if (resumeText.length > 5000) {
      return res.status(400).json({ message: "Resume text cannot exceed 5000 characters" });
    }

    const report = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription: session.jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      ...report,
      title: session.title,
      jobDescription: session.jobDescription,
      resume: resumeText,
      selfDescription: selfDescription || "",
      user: req.user.id,
      session: session._id,
    });

    session.hasReport = true;
    await session.save();

    return res.status(201).json({
      message: "Interview report generated successfully",
      report: interviewReport,
    });
  } catch (error) {
    console.error("Generate interview report error:", error);
    return res.status(500).json({ message: error?.message || "Internal server error" });
  }
}

/**
 * GET /api/interview/report/:interviewId
 */
export async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid interview report ID" });
    }

    const report = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });
    if (!report) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error("Get interview report by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/interview/
 */
export async function getAllInterviewReportsController(req, res) {
  try {
    const reports = await InterviewReport.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    console.error("Get all interview reports error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/interview/resume/pdf/:interviewReportId
 */
export async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
      return res.status(400).json({ message: "Invalid interview report ID" });
    }

    const report = await InterviewReport.findOne({ _id: interviewReportId, user: req.user.id });
    if (!report) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    const pdfBuffer = await generateResumePdf({
      resume: report.resume || "",
      selfDescription: report.selfDescription || "",
      jobDescription: report.jobDescription,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=resume-${interviewReportId}.pdf`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Generate resume pdf error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
