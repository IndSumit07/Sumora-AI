import { useState, useRef } from "react";
import {
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
  BookOpen,
  ChevronRight,
  Upload,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import InterviewChat from "../interview/InterviewChat";
import InterviewFeedback from "../interview/InterviewFeedback";

// ── Subject catalogue ─────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────────

export default function PrepareView() {
  const { uploadResume, startPrepareInterview } = useInterview();

  // phase: "setup" | "interview" | "feedback"
  const [phase, setPhase] = useState("setup");

  // Setup state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topic, setTopic] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Interview state
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [history, setHistory] = useState([]);

  // Feedback state
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // ── Handlers ────────────────────────────────────────────────────────────────

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
      const { interviewId: id, question } = await startPrepareInterview({
        subject: selectedSubject.label,
        topic: topic.trim(),
        resumeText,
      });
      setInterviewId(id);
      setCurrentQuestion(question);
      setQuestionIndex(1);
      setHistory([]);
      setPhase("interview");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session.");
    } finally {
      setStartLoading(false);
    }
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
    setPhase("feedback");
  };

  const handleRetry = () => {
    setPhase("setup");
    setSelectedSubject(null);
    setTopic("");
    setResumeFile(null);
    setResumeText("");
    setInterviewId(null);
    setCurrentQuestion("");
    setQuestionIndex(1);
    setHistory([]);
    setFeedback(null);
    setScore(0);
  };

  // ── Interview phase ──────────────────────────────────────────────────────────

  if (phase === "interview") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#ea580c]">
            Prepare
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedSubject?.label}
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {topic}
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
    );
  }

  // ── Feedback phase ───────────────────────────────────────────────────────────

  if (phase === "feedback") {
    return (
      <InterviewFeedback
        feedback={feedback}
        score={score}
        onRetry={handleRetry}
      />
    );
  }

  // ── Setup phase ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={16} className="text-[#ea580c]" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Prepare
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
          Select a subject, then enter the specific topic you want to drill on.
        </p>
      </div>

      {/* Subject grid */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Subject
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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
                <div>
                  <p
                    className={`text-[11px] font-semibold leading-tight mb-0.5 ${
                      active
                        ? "text-[#ea580c]"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight hidden sm:block">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic input */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          Specific Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !startLoading && handleStart()}
          placeholder={
            selectedSubject
              ? `e.g., ${selectedSubject.placeholder}`
              : "Select a subject above, then enter a specific topic…"
          }
          disabled={!selectedSubject}
          className="h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] px-4 text-sm bg-white dark:bg-[#161616] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Optional resume upload */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
          Resume{" "}
          <span className="normal-case font-normal text-[11px]">
            (optional — helps tailor question difficulty)
          </span>
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
            <Upload size={14} />
            Upload Resume PDF
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

      {/* Start button */}
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
            <Loader2 size={15} className="animate-spin" />
            Starting session…
          </>
        ) : (
          <>
            <BookOpen size={14} />
            Start Preparation Session
          </>
        )}
      </button>
    </div>
  );
}
