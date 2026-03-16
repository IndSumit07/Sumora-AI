import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const InterviewContext = createContext(null);

const api = axios.create({ baseURL: "/api", withCredentials: true });

export const InterviewProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // ── Session CRUD ──────────────────────────────────────────────────────────────

  const createSession = async (payload) => {
    const { data } = await api.post("/session", payload);
    return data.session;
  };

  const getAllSessions = async () => {
    setSessionsLoading(true);
    try {
      const { data } = await api.get("/session");
      setSessions(data.sessions);
      return data.sessions;
    } finally {
      setSessionsLoading(false);
    }
  };

  /**
   * getSessionById — returns { session, reports: InterviewReport[] }.
   */
  const getSessionById = async (id) => {
    const { data } = await api.get(`/session/${id}`);
    return data;
  };

  const deleteSession = async (id) => {
    await api.delete(`/session/${id}`);
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  /**
   * updateSession — JSON body, no file upload.
   */
  const updateSession = async (id, payload) => {
    const { data } = await api.patch(`/session/${id}`, payload);
    setSessions((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...data.session } : s)),
    );
    return data.session;
  };

  // ── Report generation ─────────────────────────────────────────────────────────

  /**
   * generateReport — sends sessionId + optional resume PDF to the server.
   * Resume is parsed and forwarded to Gemini but never stored.
   * @param {string} sessionId
   * @param {File|null} resumeFile — optional PDF for better analysis
   */
  const generateReport = async (sessionId, resumeFile = null) => {
    const fd = new FormData();
    fd.append("sessionId", sessionId);
    if (resumeFile) fd.append("resume", resumeFile);
    const { data } = await api.post("/interview", fd);
    toast.success("Report generated!");
    return data.report;
  };

  // ── Live interview ────────────────────────────────────────────────────────────

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
   * startInterview — creates a LiveInterview on the server and returns the first question.
   * @param {{ sessionId, resumeText, role, jobDescription }} payload
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
   * @returns {{ feedback: object, score: number }}
   */
  const endInterview = async (interviewId) => {
    const { data } = await api.post("/interview/end", { interviewId });
    return data;
  };

  /**
   * getLiveInterviewsBySession — returns all live interviews for a session (summary, newest first).
   * @param {string} sessionId
   * @returns {Promise<Array>}
   */
  const getLiveInterviewsBySession = async (sessionId) => {
    const { data } = await api.get(`/interview/live/session/${sessionId}`);
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

  // ── PDF generation ────────────────────────────────────────────────────────────

  /**
   * generatePdf — generates a tailored resume PDF and downloads it directly.
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

  return (
    <InterviewContext.Provider
      value={{
        sessions,
        sessionsLoading,
        createSession,
        getAllSessions,
        getSessionById,
        deleteSession,
        updateSession,
        generateReport,
        generatePdf,
        uploadResume,
        startInterview,
        startPrepareInterview,
        answerInterview,
        endInterview,
        getLiveInterviewsBySession,
        getLiveInterviewById,
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
