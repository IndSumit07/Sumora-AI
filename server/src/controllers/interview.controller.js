import mongoose from "mongoose";
import { createRequire } from "module";
import InterviewReport from "../models/interviewReport.model.js";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";

const _require = createRequire(import.meta.url);

/**
 * POST /api/interview/
 * Multipart form: { role?, jobDescription, selfDescription? } + optional file "resume" (PDF).
 * Resume text is extracted and passed to Gemini — NOT stored anywhere.
 */
export async function generateInterViewReportController(req, res) {
  try {
    const { role = "", jobDescription, selfDescription = "" } = req.body;

    if (!jobDescription?.trim())
      return res.status(400).json({ message: "jobDescription is required." });

    let resumeText = "";
    if (req.file) {
      try {
        const mod = _require("pdf-parse");
        const pdfParse = typeof mod === "function" ? mod : mod.default || mod;
        const result = await pdfParse(req.file.buffer);
        resumeText = (result.text || "").trim().slice(0, 8000);
      } catch (parseErr) {
        console.warn("PDF text extraction failed:", parseErr.message);
      }
    }

    const report = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription.trim(),
      jobDescription: jobDescription.trim(),
    });

    const interviewReport = await InterviewReport.create({
      ...report,
      user: req.user.id,
      role: role.trim().slice(0, 150),
      jobDescription: jobDescription.trim().slice(0, 5000),
      selfDescription: selfDescription.trim().slice(0, 2000),
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      report: interviewReport,
    });
  } catch (error) {
    console.error("Generate interview report error:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
}

/**
 * GET /api/interview/report/:interviewId
 */
export async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interview report ID" });

    const report = await InterviewReport.findOne({
      _id: interviewId,
      user: req.user.id,
    });
    if (!report)
      return res.status(404).json({ message: "Interview report not found" });

    return res.status(200).json({ report });
  } catch (error) {
    console.error("Get interview report by id error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/interview/reports
 * Returns summary list of all reports for the current user, newest first.
 */
export async function getAllReportsController(req, res) {
  try {
    const reports = await InterviewReport.find(
      { user: req.user.id },
      { _id: 1, title: 1, role: 1, matchScore: 1, createdAt: 1 },
    ).sort({ createdAt: -1 });

    return res.status(200).json({ reports });
  } catch (error) {
    console.error("Get all reports error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/interview/resume/pdf/:interviewReportId
 * Generates a tailored resume PDF via Puppeteer and streams it to the client.
 */
export async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(interviewReportId))
      return res.status(400).json({ message: "Invalid interview report ID" });

    const report = await InterviewReport.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });
    if (!report)
      return res.status(404).json({ message: "Interview report not found" });

    const pdfBuffer = await generateResumePdf({
      resume: "",
      selfDescription: report.selfDescription || "",
      jobDescription: report.jobDescription || "",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${interviewReportId}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Generate resume pdf error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /api/interview/report/:interviewId
 * Permanently deletes an AI interview report owned by the current user.
 */
export async function deleteReportController(req, res) {
  try {
    const { interviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid report ID." });

    const report = await InterviewReport.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });
    if (!report) return res.status(404).json({ message: "Report not found." });

    return res.status(200).json({ message: "Report deleted." });
  } catch (error) {
    console.error("Delete report error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
