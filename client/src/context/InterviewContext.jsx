import { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const InterviewContext = createContext(null);

const api = axios.create({ baseURL: "/api", withCredentials: true });

export const InterviewProvider = ({ children }) => {
  // ── Analyze / Report ──────────────────────────────────────────────────────

  /**
   * generateReport — sends role + jd + optional resume PDF to Gemini, saves
   * the resulting report, and returns it.
   * @param {{ role?: string, jobDescription: string, selfDescription?: string }} payload
   * @param {File|null} resumeFile — optional PDF
   */
  const generateReport = async (payload, resumeFile = null) => {
    const fd = new FormData();
    fd.append("role", payload.role || "");
    fd.append("jobDescription", payload.jobDescription || "");
    fd.append("selfDescription", payload.selfDescription || "");
    if (resumeFile) fd.append("resume", resumeFile);
    const { data } = await api.post("/interview", fd);
    toast.success("Report generated!");
    return data.report;
  };

  /**
   * getAllReports — returns a summary list of all reports for the current user.
   * @returns {Promise<Array<{_id, title, role, matchScore, createdAt}>>}
   */
  const getAllReports = async () => {
    const { data } = await api.get("/interview/reports");
    return data.reports;
  };

  /**
   * getReportById — returns a single full report.
   * @param {string} reportId
   */
  const getReportById = async (reportId) => {
    const { data } = await api.get(`/interview/report/${reportId}`);
    return data.report;
  };

  /**
   * generatePdf — generates a tailored resume PDF and downloads it directly.
   * @param {string} reportId
   */
  const generatePdf = async (reportId) => {
    const response = await api.post(`/interview/resume/pdf/${reportId}`, null, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${reportId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded!");
  };

  // ── Live interview — job mode ─────────────────────────────────────────────

  /**
   * uploadResume — parses a PDF on the server and returns extracted text.
   * @param {File} file
   * @returns {Promise<string>} resumeText
   */
  const uploadResume = async (file) => {
    const fd = new FormData();
    fd.append("resume", file);
    const { data } = await api.post("/interview/upload-resume", fd);
    return data.resumeText;
  };

  /**
   * startInterview — creates a job-mode LiveInterview and returns the first question.
   * @param {{ role: string, jobDescription: string, resumeText?: string }} payload
   * @returns {{ interviewId: string, question: string }}
   */
  const startInterview = async (payload) => {
    const { data } = await api.post("/interview/start", payload);
    return data;
  };

  /**
   * startPrepareInterview — creates a standalone topic-focused prepare session.
   * @param {{ subject: string, topic: string, resumeText?: string }} payload
   * @returns {{ interviewId: string, question: string }}
   */
  const startPrepareInterview = async (payload) => {
    const { data } = await api.post("/interview/prepare/start", payload);
    return data;
  };

  /**
   * answerInterview — submits an answer and returns the AI's next question.
   * @param {string} interviewId
   * @param {string} userAnswer
   * @returns {{ question: string }}
   */
  const answerInterview = async (interviewId, userAnswer) => {
    const { data } = await api.post("/interview/answer", {
      interviewId,
      userAnswer,
    });
    return data;
  };

  /**
   * endInterview — ends the interview and returns structured feedback + score.
   * @param {string} interviewId
   * @param {{ skipFeedback?: boolean }} [options]
   * @returns {{ feedback: object, score: number }}
   */
  const endInterview = async (interviewId, options = {}) => {
    const { data } = await api.post("/interview/end", {
      interviewId,
      ...options,
    });
    return data;
  };

  /**
   * getAllLiveInterviews — returns a summary list of live interviews for the user.
   * @param {string} [mode] — optional "job" | "prepare" filter
   * @returns {Promise<Array>}
   */
  const getAllLiveInterviews = async (mode) => {
    const url = mode ? `/interview/live?mode=${mode}` : "/interview/live";
    const { data } = await api.get(url);
    return data.interviews;
  };

  /**
   * getLiveInterviewById — returns a single live interview with full conversation + feedback.
   * @param {string} interviewId
   * @returns {Promise<object>}
   */
  const getLiveInterviewById = async (interviewId) => {
    const { data } = await api.get(`/interview/live/${interviewId}`);
    return data.interview;
  };

  /**
   * analyzeQuestion — asks the AI to teach the ideal answer for one question.
   * @param {string} interviewId
   * @param {number} questionIndex — 0-based index in conversation array
   * @returns {Promise<{ why, structure, sampleAnswer, tip }>}
   */
  const analyzeQuestion = async (interviewId, questionIndex) => {
    const { data } = await api.post("/interview/analyze-question", {
      interviewId,
      questionIndex,
    });
    return data.teaching;
  };

  const deleteLiveInterview = async (id) => {
    await api.delete(`/interview/live/${id}`);
  };

  const deleteReport = async (id) => {
    await api.delete(`/interview/report/${id}`);
  };

  /**
   * fetchJobFromUrl — fetches job details from a LinkedIn job URL.
   * @param {string} url
   * @returns {Promise<{ role: string, company: string, jobDescription: string }>}
   */
  const fetchJobFromUrl = async (url) => {
    const { data } = await api.post(
      "/interview/fetch-job",
      { url },
      { timeout: 15000 },
    );
    return data;
  };

  return (
    <InterviewContext.Provider
      value={{
        generateReport,
        getAllReports,
        getReportById,
        generatePdf,
        uploadResume,
        startInterview,
        startPrepareInterview,
        answerInterview,
        endInterview,
        getAllLiveInterviews,
        getLiveInterviewById,
        analyzeQuestion,
        deleteLiveInterview,
        deleteReport,
        fetchJobFromUrl,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx)
    throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
};
