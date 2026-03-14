import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const InterviewContext = createContext(null);

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const InterviewProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // ── Session CRUD ─────────────────────────────────────────────────────────────

  const createSession = async (title, jobDescription) => {
    const { data } = await api.post("/session", { title, jobDescription });
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

  const getSessionById = async (id) => {
    const { data } = await api.get(`/session/${id}`);
    return data; // { session, report }
  };

  // ── Report generation ─────────────────────────────────────────────────────────

  /**
   * generateReport:  sends multipart/form-data so the server can receive
   * an optional PDF file (field name "resume") alongside text fields.
   * @param {string}  sessionId
   * @param {File|null} resumeFile  – PDF file object (optional)
   * @param {string}  resumeText   – pasted resume text (used when no file)
   * @param {string}  selfDescription
   */
  const generateReport = async (
    sessionId,
    resumeFile,
    resumeText,
    selfDescription,
  ) => {
    const fd = new FormData();
    fd.append("sessionId", sessionId);
    fd.append("selfDescription", selfDescription || "");

    if (resumeFile) {
      fd.append("resume", resumeFile);
    } else {
      fd.append("resume", resumeText || "");
    }

    const { data } = await api.post("/interview", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Report generated!");
    return data.report;
  };

  // ── PDF download ──────────────────────────────────────────────────────────────

  const generatePdf = async (reportId, title) => {
    const { data } = await api.post(
      `/interview/resume/pdf/${reportId}`,
      {},
      { responseType: "blob" },
    );
    const url = URL.createObjectURL(
      new Blob([data], { type: "application/pdf" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${title || reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("PDF downloaded!");
  };

  return (
    <InterviewContext.Provider
      value={{
        sessions,
        sessionsLoading,
        createSession,
        getAllSessions,
        getSessionById,
        generateReport,
        generatePdf,
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
