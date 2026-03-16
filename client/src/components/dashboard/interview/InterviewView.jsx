import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Mic,
  Loader2,
  Upload,
  X,
  FileText,
  Calendar,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import InterviewChat from "./InterviewChat";
import InterviewFeedback from "./InterviewFeedback";
import InterviewHistoryDetail from "./InterviewHistoryDetail";

// ── Score / status badge ──────────────────────────────────────────────────────

const statusBadge = (interview) => {
  if (interview.status !== "completed")
    return { label: "In Progress", cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400" };
  const s = interview.score ?? 0;
  if (s >= 70) return { label: "Strong", cls: "bg-green-50 text-green-700" };
  if (s >= 45) return { label: "Good", cls: "bg-amber-50 text-amber-700" };
  return { label: "Needs Work", cls: "bg-red-50 text-red-600" };
};

// ── History card ──────────────────────────────────────────────────────────────

const InterviewCard = ({ interview, active, onClick }) => {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, cls } = statusBadge(interview);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-3 rounded-xl border transition-all",
        active
          ? "border-[#ea580c]/50 bg-[#ea580c]/8 dark:bg-[#ea580c]/10"
          : "border-transparent hover:border-gray-200 dark:hover:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
      ].join(" ")}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
        {interview.role || "Mock Interview"}
      </p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Calendar size={10} />
          {date}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
          {interview.status === "completed" ? `${interview.score ?? 0} · ` : ""}
          {label}
        </span>
      </div>
    </button>
  );
};

// ── Setup form ────────────────────────────────────────────────────────────────

const SetupForm = ({ onStarted }) => {
  const { uploadResume, startInterview } = useInterview();
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Only PDF accepted."); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("Resume must be under 3 MB."); return; }
    setResumeFile(file);
    setUploadLoading(true);
    try {
      const text = await uploadResume(file);
      setResumeText(text);
      toast.success("Resume parsed.");
    } catch {
      toast.error("Failed to parse resume.");
      setResumeFile(null);
      setResumeText("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleStart = async () => {
    if (!role.trim()) { toast.error("Role is required."); return; }
    if (!jobDescription.trim()) { toast.error("Job description is required."); return; }
    setStartLoading(true);
    try {
      const { interviewId, question } = await startInterview({
        role: role.trim(),
        jobDescription: jobDescription.trim(),
        resumeText,
      });
      onStarted({ interviewId, firstQuestion: question, role: role.trim() });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setStartLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
          <Mic size={16} className="text-[#ea580c]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Mock Interview
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Fill in the role details and the AI will conduct a real interview.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Role */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Role / Position
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Senior Frontend Engineer, Product Manager…"
            maxLength={150}
            className="h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] px-4 text-sm bg-white dark:bg-[#161616] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
          />
        </div>

        {/* Job description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Job Description
            </label>
            <span className="text-[11px] text-gray-400">{jobDescription.length}/5000</span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            rows={6}
            maxLength={5000}
            className="w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] px-4 py-3 text-sm bg-white dark:bg-[#161616] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all resize-none"
          />
        </div>

        {/* Resume (optional) */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Resume{" "}
            <span className="normal-case font-normal">(optional)</span>
          </p>
          {resumeFile ? (
            <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <FileText size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-300 truncate flex-1">
                {resumeFile.name}
              </span>
              {uploadLoading ? (
                <Loader2 size={14} className="animate-spin text-green-600 flex-shrink-0" />
              ) : (
                <button
                  type="button"
                  onClick={() => { setResumeFile(null); setResumeText(""); }}
                  className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl border border-dashed border-gray-300 dark:border-[#333] text-sm text-gray-500 dark:text-gray-400 hover:border-[#ea580c]/60 hover:text-[#ea580c] transition-all w-full"
            >
              <Upload size={14} /> Upload Resume PDF
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={startLoading || uploadLoading || !role.trim() || !jobDescription.trim()}
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {startLoading ? (
            <><Loader2 size={15} className="animate-spin" /> Starting interview…</>
          ) : (
            <><Mic size={14} /> Start Interview</>
          )}
        </button>
      </div>
    </div>
  );
};

// ── Empty right-panel state ───────────────────────────────────────────────────

const EmptyPanel = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <div className="h-14 w-14 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
      <Mic size={24} className="text-[#ea580c]" />
    </div>
    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      No interview selected
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 max-w-xs">
      Select a past interview from the list or start a new one.
    </p>
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
    >
      <Plus size={14} /> New Interview
    </button>
  </div>
);

// ── Main InterviewView ────────────────────────────────────────────────────────

export default function InterviewView() {
  const { getAllLiveInterviews, getLiveInterviewById } = useInterview();

  // History list state
  const [interviews, setInterviews] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Right-panel view state
  // "empty" | "detail" | "new-setup" | "new-interview" | "new-feedback"
  const [view, setView] = useState("empty");

  // Selected interview detail
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Active interview session state
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getAllLiveInterviews("job")
      .then(setInterviews)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, []);

  const handleSelectInterview = async (id) => {
    setSelectedId(id);
    setView("detail");
    setDetailLoading(true);
    try {
      const iv = await getLiveInterviewById(id);
      setSelectedInterview(iv);
    } catch {
      toast.error("Failed to load interview.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setSelectedInterview(null);
    setView("new-setup");
    // reset new interview state
    setInterviewId(null);
    setCurrentQuestion("");
    setQuestionIndex(1);
    setHistory([]);
    setFeedback(null);
    setScore(0);
  };

  const handleStarted = ({ interviewId: id, firstQuestion, role }) => {
    setInterviewId(id);
    setCurrentQuestion(firstQuestion);
    setQuestionIndex(1);
    setHistory([]);
    setView("new-interview");
    // add optimistic entry to list
    setInterviews((prev) => [
      { _id: id, mode: "job", role, score: 0, status: "active", createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const handleAnswer = (nextQuestion, submittedAnswer) => {
    setHistory((prev) => [...prev, { question: currentQuestion, answer: submittedAnswer }]);
    setCurrentQuestion(nextQuestion);
    setQuestionIndex((i) => i + 1);
  };

  const handleEnd = (fb, sc) => {
    setFeedback(fb);
    setScore(sc);
    setView("new-feedback");
    // update the optimistic entry with final score
    setInterviews((prev) =>
      prev.map((iv) =>
        iv._id === interviewId
          ? { ...iv, score: sc, status: "completed" }
          : iv,
      ),
    );
  };

  const handleRetry = () => handleNew();

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left history panel ── */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <Mic size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Interviews
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            title="New Interview"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {listLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-[#ea580c]" />
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No interviews yet.
              </p>
              <button
                type="button"
                onClick={handleNew}
                className="mt-3 text-xs font-medium text-[#ea580c] hover:underline"
              >
                Start your first one
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {interviews.map((iv) => (
                <InterviewCard
                  key={iv._id}
                  interview={iv}
                  active={selectedId === iv._id}
                  onClick={() => handleSelectInterview(iv._id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {view === "empty" && <EmptyPanel onNew={handleNew} />}

        {view === "detail" && (
          detailLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            </div>
          ) : selectedInterview ? (
            <InterviewHistoryDetail interview={selectedInterview} />
          ) : null
        )}

        {view === "new-setup" && (
          <SetupForm onStarted={handleStarted} />
        )}

        {view === "new-interview" && (
          <div>
            <div className="flex items-center gap-2 mb-6 text-xs">
              <span className="font-semibold uppercase tracking-widest text-[#ea580c]">
                Interview
              </span>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Briefcase size={11} />
                {interviews.find((iv) => iv._id === interviewId)?.role || "Mock Interview"}
              </span>
            </div>
            <InterviewChat
              interviewId={interviewId}
              currentQuestion={currentQuestion}
              questionIndex={questionIndex}
              history={history}
              onAnswer={handleAnswer}
              onEnd={handleEnd}
            />
          </div>
        )}

        {view === "new-feedback" && (
          <InterviewFeedback
            feedback={feedback}
            score={score}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
