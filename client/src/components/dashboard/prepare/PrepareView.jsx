import { useEffect, useRef, useState } from "react";
import {
  Plus,
  BookOpen,
  Loader2,
  Upload,
  X,
  FileText,
  Calendar,
  ChevronRight,
  Zap,
  Monitor,
  Database,
  Globe,
  Layers,
  GitBranch,
  Code,
  Cpu,
  Cloud,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import InterviewChat from "../interview/InterviewChat";
import InterviewFeedback from "../interview/InterviewFeedback";
import InterviewHistoryDetail from "../interview/InterviewHistoryDetail";

// ── Subject catalogue ──────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
    icon: Zap,
    desc: "Arrays, trees, graphs, sorting, dynamic programming",
    placeholder:
      "Binary Search Trees, Dijkstra's Algorithm, Dynamic Programming",
  },
  {
    id: "os",
    label: "Operating Systems",
    icon: Monitor,
    desc: "Processes, memory management, scheduling, deadlocks",
    placeholder: "Process Scheduling, Deadlocks, Virtual Memory",
  },
  {
    id: "dbms",
    label: "Databases",
    icon: Database,
    desc: "SQL, NoSQL, indexing, ACID, transactions",
    placeholder: "ACID Properties, B-Tree Indexing, Query Optimization",
  },
  {
    id: "networks",
    label: "Computer Networks",
    icon: Globe,
    desc: "TCP/IP, DNS, HTTP, routing protocols",
    placeholder: "TCP Handshake, DNS Resolution, HTTP/2 vs HTTP/3",
  },
  {
    id: "system-design",
    label: "System Design",
    icon: Layers,
    desc: "Scalability, microservices, load balancing, caching",
    placeholder: "Rate Limiting, Consistent Hashing, CAP Theorem",
  },
  {
    id: "oop",
    label: "OOP & Design Patterns",
    icon: GitBranch,
    desc: "SOLID principles, design patterns, abstraction",
    placeholder: "Design Patterns, SOLID Principles, Polymorphism",
  },
  {
    id: "web",
    label: "Web Development",
    icon: Code,
    desc: "Frontend, backend, REST APIs, authentication",
    placeholder: "React Hooks, REST vs GraphQL, CSRF / XSS",
  },
  {
    id: "ml",
    label: "Machine Learning",
    icon: Cpu,
    desc: "Algorithms, neural networks, model evaluation",
    placeholder: "Gradient Descent, Overfitting, Transformer Architecture",
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    icon: Cloud,
    desc: "AWS, Docker, CI/CD, Kubernetes infrastructure",
    placeholder: "Docker Networking, Kubernetes Pods, AWS Lambda",
  },
  {
    id: "security",
    label: "Cybersecurity",
    icon: Shield,
    desc: "Authentication, encryption, common vulnerabilities",
    placeholder: "SQL Injection, JWT Auth, TLS/SSL",
  },
];

// ── Score / status badge ───────────────────────────────────────────────────────

const statusBadge = (iv) => {
  if (iv.status !== "completed")
    return {
      label: "In Progress",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400",
    };
  const s = iv.score ?? 0;
  if (s >= 70) return { label: "Strong", cls: "bg-green-50 text-green-700" };
  if (s >= 45) return { label: "Good", cls: "bg-amber-50 text-amber-700" };
  return { label: "Needs Work", cls: "bg-red-50 text-red-600" };
};

// ── History card ───────────────────────────────────────────────────────────────

const PrepareCard = ({ interview, active, onClick }) => {
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
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-0.5">
        {interview.topic || interview.subject || "Prep Session"}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mb-1.5">
        {interview.subject || ""}
      </p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Calendar size={10} />
          {date}
        </span>
        <div className="flex items-center gap-1.5">
          {interview.difficulty && interview.difficulty !== "medium" && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                interview.difficulty === "easy"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              }`}
            >
              {interview.difficulty}
            </span>
          )}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}
          >
            {interview.status === "completed"
              ? `${interview.score ?? 0} · `
              : ""}
            {label}
          </span>
        </div>
      </div>
    </button>
  );
};

// ── Setup form ─────────────────────────────────────────────────────────────────

const SetupForm = ({ onStarted }) => {
  const { uploadResume, startPrepareInterview } = useInterview();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topic, setTopic] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Resume must be under 3 MB.");
      return;
    }
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
    if (!selectedSubject) {
      toast.error("Please select a subject.");
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a specific topic.");
      return;
    }
    setStartLoading(true);
    try {
      const { interviewId, question } = await startPrepareInterview({
        subject: selectedSubject.label,
        topic: topic.trim(),
        resumeText,
        difficulty,
      });
      onStarted({
        interviewId,
        firstQuestion: question,
        subject: selectedSubject.label,
        topic: topic.trim(),
        difficulty,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session.");
    } finally {
      setStartLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
          <BookOpen size={16} className="text-[#ea580c]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Preparation Session
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Select a subject, then enter a specific topic to drill on.
          </p>
        </div>
      </div>

      {/* Subject grid */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Subject
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            const active = selectedSubject?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={[
                  "flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-150",
                  active
                    ? "border-[#ea580c] bg-[#ea580c]/8 dark:bg-[#ea580c]/10 shadow-sm"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] hover:border-[#ea580c]/40 hover:bg-orange-50/40 dark:hover:bg-[#1e1e1e]",
                ].join(" ")}
              >
                <Icon
                  size={16}
                  className={
                    active
                      ? "text-[#ea580c]"
                      : "text-gray-400 dark:text-gray-500"
                  }
                />
                <p
                  className={`text-[11px] font-semibold leading-tight ${
                    active
                      ? "text-[#ea580c]"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {/* Specific topic */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Specific Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !startLoading && handleStart()
            }
            placeholder={
              selectedSubject
                ? `e.g., ${selectedSubject.placeholder}`
                : "Select a subject above, then enter a specific topic…"
            }
            disabled={!selectedSubject}
            className="h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] px-4 text-sm bg-white dark:bg-[#161616] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Optional resume */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Resume <span className="normal-case font-normal">(optional)</span>
          </p>
          {resumeFile ? (
            <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <FileText
                size={14}
                className="text-green-600 dark:text-green-400 flex-shrink-0"
              />
              <span className="text-sm text-green-700 dark:text-green-300 truncate flex-1">
                {resumeFile.name}
              </span>
              {uploadLoading ? (
                <Loader2
                  size={14}
                  className="animate-spin text-green-600 dark:text-green-400 flex-shrink-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setResumeText("");
                  }}
                  className="text-green-600 dark:text-green-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl border border-dashed border-gray-300 dark:border-[#333] text-sm text-gray-500 dark:text-gray-400 hover:border-[#ea580c]/60 hover:text-[#ea580c] transition-all w-full"
            >
              <Upload size={14} /> Upload Resume PDF
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Difficulty
          </label>
          <div className="flex gap-2">
            {[
              {
                value: "easy",
                label: "Easy",
                active:
                  "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
              },
              {
                value: "medium",
                label: "Medium",
                active:
                  "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
              },
              {
                value: "hard",
                label: "Hard",
                active:
                  "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
              },
            ].map(({ value, label, active }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDifficulty(value)}
                className={[
                  "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                  difficulty === value
                    ? active
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={
            startLoading || uploadLoading || !selectedSubject || !topic.trim()
          }
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {startLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Starting session…
            </>
          ) : (
            <>
              <BookOpen size={14} /> Start Preparation Session
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── Empty right-panel state ────────────────────────────────────────────────────

const EmptyPanel = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <div className="h-14 w-14 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
      <BookOpen size={24} className="text-[#ea580c]" />
    </div>
    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      No session selected
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 max-w-xs">
      Select a past session from the list or start a new one.
    </p>
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
    >
      <Plus size={14} /> New Session
    </button>
  </div>
);

// ── Main PrepareView ───────────────────────────────────────────────────────────

export default function PrepareView() {
  const { getAllLiveInterviews, getLiveInterviewById } = useInterview();

  // History list state
  const [sessions, setSessions] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Right-panel view state
  // "empty" | "detail" | "new-setup" | "new-interview" | "new-feedback"
  const [view, setView] = useState("empty");

  // Selected session detail
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Active session state
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  // Track subject/topic for breadcrumb
  const [activeSubject, setActiveSubject] = useState("");
  const [activeTopic, setActiveTopic] = useState("");

  useEffect(() => {
    getAllLiveInterviews("prepare")
      .then(setSessions)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, []);

  const handleSelectSession = async (id) => {
    setSelectedId(id);
    setView("detail");
    setDetailLoading(true);
    try {
      const iv = await getLiveInterviewById(id);
      setSelectedSession(iv);
    } catch {
      toast.error("Failed to load session.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setSelectedSession(null);
    setView("new-setup");
    setInterviewId(null);
    setCurrentQuestion("");
    setQuestionIndex(1);
    setHistory([]);
    setFeedback(null);
    setScore(0);
    setActiveSubject("");
    setActiveTopic("");
  };

  const handleStarted = ({
    interviewId: id,
    firstQuestion,
    subject,
    topic,
    difficulty,
  }) => {
    setInterviewId(id);
    setCurrentQuestion(firstQuestion);
    setQuestionIndex(1);
    setHistory([]);
    setActiveSubject(subject);
    setActiveTopic(topic);
    setView("new-interview");
    // optimistic list entry
    setSessions((prev) => [
      {
        _id: id,
        mode: "prepare",
        subject,
        topic,
        difficulty,
        score: 0,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleAnswer = (nextQuestion, submittedAnswer) => {
    setHistory((prev) => [
      ...prev,
      { question: currentQuestion, answer: submittedAnswer },
    ]);
    setCurrentQuestion(nextQuestion);
    setQuestionIndex((i) => i + 1);
  };

  const handleEnd = (fb, sc) => {
    setFeedback(fb);
    setScore(sc);
    setView("new-feedback");
    setSessions((prev) =>
      prev.map((iv) =>
        iv._id === interviewId ? { ...iv, score: sc, status: "completed" } : iv,
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
            <BookOpen size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Prepare
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            title="New Session"
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
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No sessions yet.
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
              {sessions.map((iv) => (
                <PrepareCard
                  key={iv._id}
                  interview={iv}
                  active={selectedId === iv._id}
                  onClick={() => handleSelectSession(iv._id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {view === "empty" && <EmptyPanel onNew={handleNew} />}

        {view === "detail" &&
          (detailLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            </div>
          ) : selectedSession ? (
            <InterviewHistoryDetail interview={selectedSession} />
          ) : null)}

        {view === "new-setup" && <SetupForm onStarted={handleStarted} />}

        {view === "new-interview" && (
          <div>
            <div className="flex items-center gap-2 mb-6 text-xs flex-wrap">
              <span className="font-semibold uppercase tracking-widest text-[#ea580c]">
                Prepare
              </span>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {activeSubject}
              </span>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {activeTopic}
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
