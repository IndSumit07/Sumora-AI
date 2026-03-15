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
 * Multipart form: { sessionId } + optional file field "resume" (PDF).
 * Resume text is extracted and passed to Gemini — NOT stored anywhere.
 */
export async function generateInterViewReportController(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId)
      return res.status(400).json({ message: "Session ID is required" });
    if (!mongoose.Types.ObjectId.isValid(sessionId))
      return res.status(400).json({ message: "Invalid session ID" });

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Extract resume text from the uploaded PDF (if provided) — discarded after use
    let resumeText = "";
    if (req.file) {
      try {
        const { PDFParse } = _require("pdf-parse");
        const parser = new PDFParse({ data: req.file.buffer, verbosity: 0 });
        const result = await parser.getText();
        resumeText = (result.text || "").trim().slice(0, 8000);
      } catch (parseErr) {
        console.warn("PDF text extraction failed:", parseErr.message);
      }
    }

    const report = await generateInterviewReport({
      resume: resumeText,
      selfDescription: session.selfDescription,
      jobDescription: session.jobDescription,
    });

    const interviewReport = await InterviewReport.create({
      ...report,
      user: req.user.id,
      session: session._id,
    });

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

    if (!mongoose.Types.ObjectId.isValid(interviewId))
      return res.status(400).json({ message: "Invalid interview report ID" });

    const report = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });
    if (!report)
      return res.status(404).json({ message: "Interview report not found" });

    return res.status(200).json({ report });
  } catch (error) {
    console.error("Get interview report by id error:", error);
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
    }).populate("session");
    if (!report)
      return res.status(404).json({ message: "Interview report not found" });

    const session = report.session;
    if (!session) return res.status(404).json({ message: "Session not found" });

    const pdfBuffer = await generateResumePdf({
      resume: "",
      selfDescription: session.selfDescription,
      jobDescription: session.jobDescription,
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
