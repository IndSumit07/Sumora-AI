import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Plus,
  Code2,
  Loader2,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Play,
  Send,
  MessageSquare,
  Terminal,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  List,
  Settings,
  Languages,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import { useAuth } from "../../../context/AuthContext";
import useServiceExitGuard from "../../../hooks/useServiceExitGuard";
import ServiceExitConfirmModal from "../../ServiceExitConfirmModal";
import { TokenConfirmModal } from "../../TokenConfirmModal";
import CodingInterviewFeedback from "./CodingInterviewFeedback";
import CodingInterviewHistoryDetail from "./CodingInterviewHistoryDetail";

// ── Difficulty badge ──────────────────────────────────────────────────────────

const diffColors = {
  easy: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  medium: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  hard: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const statusBadge = (interview) => {
  if (interview.status !== "completed")
    return {
      label: "In Progress",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400",
    };
  const s = interview.score ?? 0;
  if (s <= 0)
    return {
      label: "Completed",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300",
    };
  if (s >= 70) return { label: "Strong", cls: "bg-green-50 text-green-700" };
  if (s >= 45) return { label: "Good", cls: "bg-amber-50 text-amber-700" };
  return { label: "Needs Work", cls: "bg-red-50 text-red-600" };
};

// ── History card ──────────────────────────────────────────────────────────────

const InterviewCard = ({ interview, active, onClick, onDelete }) => {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, cls } = statusBadge(interview);

  return (
    <div
      role="button"
      onClick={onClick}
      className={[
        "relative group w-full text-left px-3 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
        active
          ? "border-[#ea580c]/60 bg-gradient-to-r from-[#ea580c]/10 to-[#ea580c]/5 dark:from-[#ea580c]/15 dark:to-[#ea580c]/5 shadow-sm shadow-[#ea580c]/10"
          : "border-transparent hover:border-gray-200 dark:hover:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
      ].join(" ")}
    >
      {active && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#ea580c]" />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(interview._id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span
          className={[
            "text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider",
            diffColors[interview.difficulty] || diffColors.medium,
          ].join(" ")}
        >
          {interview.difficulty}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
          {interview.language}
        </span>
      </div>
      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate pr-6">
        {interview.problemStatement?.slice(0, 60) || "Coding Interview"}
        {interview.problemStatement?.length > 60 ? "..." : ""}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={["text-[10px] font-bold px-1.5 py-0.5 rounded-md", cls].join(" ")}>
          {label}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Calendar size={10} />
          {date}
        </span>
      </div>
    </div>
  );
};

// ── Language options ────────────────────────────────────────────────────────────

const LANGUAGES = [
  { key: "python", name: "Python", monaco: "python" },
  { key: "java", name: "Java", monaco: "java" },
  { key: "cpp", name: "C++", monaco: "cpp" },
  { key: "javascript", name: "JavaScript", monaco: "javascript" },
  { key: "typescript", name: "TypeScript", monaco: "typescript" },
  { key: "go", name: "Go", monaco: "go" },
  { key: "rust", name: "Rust", monaco: "rust" },
  { key: "csharp", name: "C#", monaco: "csharp" },
];

const DIFFICULTIES = [
  { key: "easy", label: "Easy", desc: "Standard array/string problems" },
  { key: "medium", label: "Medium", desc: "Two-pointer, sliding window, trees" },
  { key: "hard", label: "Hard", desc: "Advanced DP, graphs, segment trees" },
];

// ── Main component ──────────────────────────────────────────────────────────────

const CodingInterviewView = () => {
  const { user } = useAuth();
  const {
    startCodingInterview,
    submitCode,
    sendCodingMessage,
    endCodingInterview,
    getAllCodingInterviews,
    getCodingInterviewById,
    deleteCodingInterview,
  } = useInterview();

  const [view, setView] = useState("list"); // list | setup | active | detail | feedback
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Setup state
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  // Active interview state
  const [activeInterview, setActiveInterview] = useState(null);
  const [problemStatement, setProblemStatement] = useState("");
  const [examples, setExamples] = useState("");
  const [constraints, setConstraints] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [code, setCode] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showTokenConfirm, setShowTokenConfirm] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  // ── Load history ────────────────────────────────────────────────────────────

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCodingInterviews(page);
      setInterviews(data.interviews || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  }, [getAllCodingInterviews, page]);

  useEffect(() => {
    if (view === "list") loadInterviews();
  }, [view, page, loadInterviews]);

  // ── Timer ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (view === "active" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleEndInterview();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ── Service exit guard ──────────────────────────────────────────────────────

  const isServiceActive = view === "active";
  const { showExitConfirm, setShowExitConfirm, confirmExit } =
    useServiceExitGuard(isServiceActive, async () => {
      await handleEndInterview();
    });

  // ── Start interview ─────────────────────────────────────────────────────────

  const handleStart = () => {
    if ((user?.tokens || 0) < 35) {
      toast.error("You need at least 35 tokens to start a coding interview.");
      return;
    }
    setShowTokenConfirm(true);
  };

  const confirmStart = async () => {
    setShowTokenConfirm(false);
    try {
      setLoading(true);
      const data = await startCodingInterview({
        difficulty: selectedDifficulty,
        language: selectedLanguage,
      });

      setActiveInterview(data);
      setProblemStatement(data.problemStatement || "");
      setExamples(data.examples || "");
      setConstraints(data.constraints || "");
      setStarterCode(data.starterCode || "");
      setCode(data.starterCode || "");
      setChatMessages([
        { role: "agent", text: data.problemStatement || "Welcome to your coding interview!" },
      ]);
      setTimeLeft(data.durationSeconds || 45 * 60);
      setView("active");
      toast.success("Coding interview started!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit code ─────────────────────────────────────────────────────────────

  const handleSubmitCode = async () => {
    if (!code.trim() || !activeInterview?.interviewId) return;
    try {
      setSubmitting(true);
      const data = await submitCode({
        interviewId: activeInterview.interviewId,
        code,
      });

      setChatMessages((prev) => [
        ...prev,
        { role: "user", text: "Submitted solution", isCode: true },
        { role: "agent", text: data.analysis },
      ]);
      toast.success("Code submitted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit code");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Send chat message ───────────────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeInterview?.interviewId) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);

    try {
      setSubmitting(true);
      const data = await sendCodingMessage({
        interviewId: activeInterview.interviewId,
        message: msg,
      });
      setChatMessages((prev) => [...prev, { role: "agent", text: data.response }]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  // ── End interview ───────────────────────────────────────────────────────────

  const handleEndInterview = async () => {
    if (!activeInterview?.interviewId) return;
    try {
      setLoading(true);
      const data = await endCodingInterview(activeInterview.interviewId);
      setFeedback(data.feedback);
      setScore(data.score || 0);
      setActiveInterview(null);
      setView("feedback");
      toast.success("Interview completed!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to end interview");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coding interview?")) return;
    try {
      await deleteCodingInterview(id);
      setInterviews((prev) => prev.filter((i) => i._id !== id));
      if (selectedInterview?._id === id) {
        setSelectedInterview(null);
        setView("list");
      }
      toast.success("Deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  // ── View detail ─────────────────────────────────────────────────────────────

  const handleViewDetail = async (interview) => {
    try {
      setLoading(true);
      const data = await getCodingInterviewById(interview._id);
      setSelectedInterview(data.interview);
      setView("detail");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  // ── Scroll chat ───────────────────────────────────────────────────────────────

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  // ── LIST VIEW ───────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Code2 size={20} className="text-[#ea580c]" />
              Coding Interviews
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Practice DSA and system design with live AI coding interviews
            </p>
          </div>
          <button
            onClick={() => setView("setup")}
            className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus size={14} />
            New Interview
          </button>
        </div>

        {loading && interviews.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#ea580c]" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Code2 size={48} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              No coding interviews yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              Start your first coding interview to practice algorithms, data structures, and system design.
            </p>
            <button
              onClick={() => setView("setup")}
              className="mt-4 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Start Coding Interview
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  active={selectedInterview?._id === interview._id}
                  onClick={() => handleViewDetail(interview)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a2a] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a2a] disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── SETUP VIEW ──────────────────────────────────────────────────────────────
  if (view === "setup") {
    return (
      <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 w-fit"
        >
          <ChevronLeft size={14} />
          Back to history
        </button>

        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Start Coding Interview
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Select your preferred language and difficulty level. The AI interviewer will generate a problem tailored to your choice.
          </p>

          {/* Language selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Languages size={14} className="text-[#ea580c]" />
              Programming Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => setSelectedLanguage(lang.key)}
                  className={[
                    "px-3 py-2.5 rounded-xl border text-xs font-bold transition-all",
                    selectedLanguage === lang.key
                      ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                      : "border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
                  ].join(" ")}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selector */}
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Settings size={14} className="text-[#ea580c]" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.key}
                  onClick={() => setSelectedDifficulty(diff.key)}
                  className={[
                    "px-3 py-3 rounded-xl border text-left transition-all",
                    selectedDifficulty === diff.key
                      ? "border-[#ea580c] bg-[#ea580c]/10"
                      : "border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-xs font-bold uppercase tracking-wider",
                      selectedDifficulty === diff.key
                        ? "text-[#ea580c]"
                        : "text-gray-700 dark:text-gray-300",
                    ].join(" ")}
                  >
                    {diff.label}
                  </span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {diff.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Token cost */}
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This will cost <strong>35 tokens</strong>. You have{" "}
              <strong>{user?.tokens || 0} tokens</strong> remaining.
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={loading || (user?.tokens || 0) < 35}
            className="w-full bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Play size={16} />
                Start Coding Interview
              </>
            )}
          </button>
        </div>

        <TokenConfirmModal
          open={showTokenConfirm}
          cost={35}
          tokens={user?.tokens || 0}
          onConfirm={confirmStart}
          onCancel={() => setShowTokenConfirm(false)}
          confirming={loading}
          serviceName="Coding Interview"
          description="Practice DSA and system design with a live AI coding interviewer."
        />
      </div>
    );
  }

  // ── ACTIVE INTERVIEW VIEW ───────────────────────────────────────────────────
  if (view === "active") {
    const lang = LANGUAGES.find((l) => l.key === selectedLanguage);

    return (
      <div className="h-full flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222] flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Code2 size={14} className="text-[#ea580c]" />
              Coding Interview
            </span>
            <span
              className={[
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase",
                diffColors[selectedDifficulty],
              ].join(" ")}
            >
              {selectedDifficulty}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase">
              {lang?.name || selectedLanguage}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={[
                "text-xs font-mono font-bold flex items-center gap-1",
                timeLeft < 300 ? "text-red-500" : "text-gray-600 dark:text-gray-400",
              ].join(" ")}
            >
              <Clock size={14} />
              {formatTime(timeLeft)}
            </span>
            <button
              onClick={() => setShowEndConfirm(true)}
              className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              End
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Problem + Chat */}
          <div className="w-1/3 min-w-[320px] max-w-[420px] flex flex-col border-r border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#0d0d0d]">
            {/* Problem statement */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#121212]">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Terminal size={14} className="text-[#ea580c]" />
                Problem Statement
              </h3>
              <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                {problemStatement}
              </div>
              {examples && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Examples
                  </p>
                  <pre className="text-[11px] text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1a1a] p-2 rounded-lg overflow-x-auto">
                    {examples}
                  </pre>
                </div>
              )}
              {constraints && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Constraints
                  </p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400">
                    {constraints}
                  </p>
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={[
                      "text-xs rounded-xl px-3 py-2 max-w-[95%]",
                      msg.role === "agent"
                        ? "bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#2a2a2a]"
                        : "bg-[#ea580c]/10 text-[#ea580c] ml-auto",
                    ].join(" ")}
                  >
                    {msg.isCode && (
                      <span className="text-[10px] font-bold opacity-70 block mb-1">
                        Submitted code
                      </span>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-3 border-t border-gray-200 dark:border-[#222] bg-white dark:bg-[#121212]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question or request a hint..."
                    className="flex-1 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#ea580c]/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={submitting || !chatInput.trim()}
                    className="p-2 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Code editor */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-mono">
                  solution.{lang?.key === "python" ? "py" : lang?.key === "java" ? "java" : lang?.key === "cpp" ? "cpp" : lang?.key === "javascript" ? "js" : lang?.key === "typescript" ? "ts" : lang?.key === "go" ? "go" : lang?.key === "rust" ? "rs" : lang?.key === "csharp" ? "cs" : "txt"}
                </span>
              </div>
              <button
                onClick={handleSubmitCode}
                disabled={submitting || !code.trim()}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors"
              >
                {submitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                Submit Code
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={lang?.monaco || "python"}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 },
                  folding: true,
                  bracketPairColorization: { enabled: true },
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 4,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        </div>

        <ServiceExitConfirmModal
          open={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          onConfirm={async () => {
            setShowExitConfirm(false);
            await handleEndInterview();
          }}
        />
      </div>
    );
  }

  // ── DETAIL VIEW ───────────────────────────────────────────────────────────────
  if (view === "detail" && selectedInterview) {
    return (
      <CodingInterviewHistoryDetail
        interview={selectedInterview}
        onBack={() => {
          setSelectedInterview(null);
          setView("list");
        }}
      />
    );
  }

  // ── FEEDBACK VIEW ─────────────────────────────────────────────────────────────
  if (view === "feedback" && feedback) {
    return (
      <CodingInterviewFeedback
        feedback={feedback}
        score={score}
        onBack={() => {
          setFeedback(null);
          setScore(0);
          setView("list");
        }}
      />
    );
  }

  return null;
};

export default CodingInterviewView;
