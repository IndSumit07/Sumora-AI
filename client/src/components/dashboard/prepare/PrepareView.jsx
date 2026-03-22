import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  Trash2,
  Radio,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import InterviewChat from "../interview/InterviewChat";
import InterviewFeedback from "../interview/InterviewFeedback";
import InterviewHistoryDetail from "../interview/InterviewHistoryDetail";
import VoiceInterviewAgent from "../interview/VoiceInterviewAgent";

// ── Subject catalogue ──────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
    icon: Zap,
    desc: "Arrays, trees, graphs, sorting, dynamic programming",
    topics: [
      "Arrays & Strings",
      "Linked Lists",
      "Trees & BSTs",
      "Graphs",
      "Dynamic Programming",
      "Sorting & Searching",
      "Recursion & Backtracking",
      "Heaps & Priority Queues",
      "Hash Tables",
      "Tries",
    ],
  },
  {
    id: "os",
    label: "Operating Systems",
    icon: Monitor,
    desc: "Processes, memory management, scheduling, deadlocks",
    topics: [
      "Process Scheduling",
      "Deadlocks",
      "Virtual Memory",
      "Paging & Segmentation",
      "Threads & Concurrency",
      "File Systems",
      "Semaphores & Mutexes",
      "Memory Allocation",
      "I/O Management",
    ],
  },
  {
    id: "dbms",
    label: "Databases",
    icon: Database,
    desc: "SQL, NoSQL, indexing, ACID, transactions",
    topics: [
      "SQL Queries",
      "ACID Properties",
      "Normalization",
      "Indexing & B-Trees",
      "Transactions",
      "Query Optimization",
      "NoSQL Databases",
      "ER Diagrams",
      "Joins",
    ],
  },
  {
    id: "networks",
    label: "Computer Networks",
    icon: Globe,
    desc: "TCP/IP, DNS, HTTP, routing protocols",
    topics: [
      "TCP/IP Model",
      "OSI Model",
      "DNS Resolution",
      "HTTP/HTTPS",
      "Routing Protocols",
      "Subnetting",
      "Firewalls & NAT",
      "WebSockets",
      "CDN & Caching",
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    icon: Layers,
    desc: "Scalability, microservices, load balancing, caching",
    topics: [
      "Load Balancing",
      "Caching Strategies",
      "Rate Limiting",
      "CAP Theorem",
      "Database Sharding",
      "Consistent Hashing",
      "Microservices",
      "Message Queues",
      "API Design",
    ],
  },
  {
    id: "oop",
    label: "OOP & Design Patterns",
    icon: GitBranch,
    desc: "SOLID principles, design patterns, abstraction",
    topics: [
      "SOLID Principles",
      "Design Patterns",
      "Inheritance & Polymorphism",
      "Abstraction & Encapsulation",
      "Factory Pattern",
      "Singleton Pattern",
      "Observer Pattern",
      "Strategy Pattern",
    ],
  },
  {
    id: "web",
    label: "Web Development",
    icon: Code,
    desc: "Frontend, backend, REST APIs, authentication",
    topics: [
      "React Hooks",
      "REST APIs",
      "GraphQL",
      "Authentication & JWT",
      "CSRF & XSS",
      "CSS Fundamentals",
      "Browser Rendering",
      "HTTP/2 & HTTP/3",
      "WebSockets",
    ],
  },
  {
    id: "ml",
    label: "Machine Learning",
    icon: Cpu,
    desc: "Algorithms, neural networks, model evaluation",
    topics: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Gradient Descent",
      "Overfitting & Regularization",
      "Transformers",
      "CNNs & RNNs",
      "Model Evaluation",
      "Feature Engineering",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    icon: Cloud,
    desc: "AWS, Docker, CI/CD, Kubernetes infrastructure",
    topics: [
      "Docker",
      "Kubernetes",
      "CI/CD Pipelines",
      "AWS Services",
      "Serverless",
      "Infrastructure as Code",
      "Monitoring & Logging",
      "Microservices Deploy",
    ],
  },
  {
    id: "security",
    label: "Cybersecurity",
    icon: Shield,
    desc: "Authentication, encryption, common vulnerabilities",
    topics: [
      "SQL Injection",
      "XSS & CSRF",
      "Authentication & OAuth",
      "JWT Security",
      "TLS/SSL",
      "Encryption Basics",
      "Penetration Testing",
      "Zero Trust Security",
    ],
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
  if (s <= 0)
    return {
      label: "Completed",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300",
    };
  if (s >= 70) return { label: "Strong", cls: "bg-green-50 text-green-700" };
  if (s >= 45) return { label: "Good", cls: "bg-amber-50 text-amber-700" };
  return { label: "Needs Work", cls: "bg-red-50 text-red-600" };
};

// ── History card ───────────────────────────────────────────────────────────────

const PrepareCard = ({ interview, active, onClick, onDelete }) => {
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
        "relative group w-full text-left px-3 py-3 rounded-xl border transition-all cursor-pointer",
        active
          ? "border-[#ea580c]/50 bg-[#ea580c]/8 dark:bg-[#ea580c]/10"
          : "border-transparent hover:border-gray-200 dark:hover:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(interview._id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        title="Delete"
      >
        <Trash2 size={12} />
      </button>

      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-0.5 pr-5">
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
          {interview.difficulty && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                interview.difficulty === "easy"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : interview.difficulty === "medium"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
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
    </div>
  );
};

// ── Setup form ─────────────────────────────────────────────────────────────────

const SetupForm = ({ onStarted }) => {
  const { uploadResume, startPrepareInterview } = useInterview();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewMode, setInterviewMode] = useState("interactive"); // "interactive" | "analytic"
  const fileInputRef = useRef(null);
  const topicInputRef = useRef(null);

  // Sync external store to force re-render when window.speakMode changes
  const speakMode = useSyncExternalStore(
    (onStoreChange) => {
      document.addEventListener("speakModeChanged", onStoreChange);
      return () =>
        document.removeEventListener("speakModeChanged", onStoreChange);
    },
    () => window.speakMode || "hold",
  );

  const handleSubjectToggle = (s) => {
    setSelectedSubjects((prev) => {
      if (prev.find((sub) => sub.id === s.id)) {
        // If unselecting a subject, optionally remove its topics from selectedTopics
        const remainingSubjects = prev.filter((sub) => sub.id !== s.id);
        const subjectTopics = s.topics || [];
        setSelectedTopics((prevTopics) =>
          prevTopics.filter((t) => !subjectTopics.includes(t)),
        );
        return remainingSubjects;
      } else {
        return [...prev, s];
      }
    });
  };

  const toggleTopic = (label) => {
    setSelectedTopics((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  };

  const addCustomTopic = () => {
    const t = topicInput.trim();
    if (!t) return;
    if (!selectedTopics.includes(t)) {
      setSelectedTopics((prev) => [...prev, t]);
    }
    setTopicInput("");
    topicInputRef.current?.focus();
  };

  const removeSelectedTopic = (label) => {
    setSelectedTopics((prev) => prev.filter((t) => t !== label));
  };

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
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject.");
      return;
    }
    const allTopics = [...selectedTopics];
    if (topicInput.trim() && !allTopics.includes(topicInput.trim())) {
      allTopics.push(topicInput.trim());
    }
    if (allTopics.length === 0) {
      toast.error("Please select or enter at least one topic.");
      return;
    }
    const subjectString = selectedSubjects.map((s) => s.label).join(", ");
    const topicString = allTopics.join(", ");
    setStartLoading(true);
    try {
      const { interviewId, question } = await startPrepareInterview({
        subject: subjectString,
        topic: topicString,
        resumeText,
        difficulty,
      });
      onStarted({
        interviewId,
        firstQuestion: question,
        subject: subjectString,
        topic: topicString,
        difficulty,
        mode: interviewMode,
        resumeText,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session.");
    } finally {
      setStartLoading(false);
    }
  };

  const canStart =
    !startLoading &&
    !uploadLoading &&
    selectedSubjects.length > 0 &&
    (selectedTopics.length > 0 || topicInput.trim().length > 0);

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
            Select one or more subjects, pick topics or type your own, then
            start drilling.
          </p>
        </div>
      </div>

      {/* Subject grid */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Subjects
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SUBJECTS.map((s) => {
            const Icon = s.icon;
            const active = !!selectedSubjects.find((sub) => sub.id === s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSubjectToggle(s)}
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

      {/* Topic picker — shown after subject is selected */}
      {selectedSubjects.length > 0 && (
        <div className="mb-5 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#161616] p-4">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Topics{" "}
            <span className="normal-case font-normal text-gray-400 dark:text-gray-500">
              — pick one or more across selected subjects
            </span>
          </p>

          {/* Suggested topic chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selectedSubjects
              .flatMap((s) => s.topics)
              .map((t) => {
                const picked = selectedTopics.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTopic(t)}
                    className={[
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                      picked
                        ? "border-[#ea580c] bg-[#ea580c] text-white"
                        : "border-gray-200 dark:border-[#333] bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:border-[#ea580c]/50 hover:text-[#ea580c]",
                    ].join(" ")}
                  >
                    {t}
                    {picked && <X size={10} className="ml-0.5" />}
                  </button>
                );
              })}
          </div>

          {/* Custom topic input */}
          <div className="flex gap-2">
            <input
              ref={topicInputRef}
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTopic();
                }
              }}
              placeholder="Or type a custom topic and press Enter…"
              className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-[#333] px-3 text-xs bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
            />
            <button
              type="button"
              onClick={addCustomTopic}
              disabled={!topicInput.trim()}
              className="h-9 px-3 rounded-lg border border-gray-200 dark:border-[#333] text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] hover:border-[#ea580c]/50 hover:text-[#ea580c] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {/* Selected topic pills row */}
          {selectedTopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedTopics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeSelectedTopic(t)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
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

        {/* Interview Mode */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Interview Mode
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInterviewMode("interactive")}
              className={[
                "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-1",
                interviewMode === "interactive"
                  ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              <Radio size={14} />
              <span>Interactive</span>
            </button>
            <button
              type="button"
              onClick={() => setInterviewMode("analytic")}
              className={[
                "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-1",
                interviewMode === "analytic"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              <MessageSquare size={14} />
              <span>Analytic</span>
            </button>
          </div>
        </div>

        {/* Speak Mode Settings (Only visible for interactive mode) */}
        {interviewMode === "interactive" && (
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
              Speak Mode
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.speakMode = "normal";
                  document.dispatchEvent(new Event("speakModeChanged"));
                }}
                className={[
                  "flex-1 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
                  speakMode === "normal"
                    ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                Speak Normally
              </button>
              <button
                type="button"
                onClick={() => {
                  window.speakMode = "hold";
                  document.dispatchEvent(new Event("speakModeChanged"));
                }}
                className={[
                  "flex-1 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
                  speakMode === "hold"
                    ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                Hold Space to Speak
              </button>
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Difficulty
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDifficulty("easy")}
              className={[
                "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                difficulty === "easy"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("medium")}
              className={[
                "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                difficulty === "medium"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("hard")}
              className={[
                "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                difficulty === "hard"
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              Hard
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
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
  const { getAllLiveInterviews, getLiveInterviewById, deleteLiveInterview } =
    useInterview();

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
  const [interviewMode, setInterviewMode] = useState("analytic"); // "interactive" | "analytic"
  const [voiceContext, setVoiceContext] = useState(null); // For voice agent

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
    mode,
    resumeText,
  }) => {
    setInterviewId(id);
    setInterviewMode(mode || "analytic");
    setActiveSubject(subject);
    setActiveTopic(topic);

    if (mode === "interactive") {
      // Setup voice agent context tailored for Preparation
      const systemPrompt = `You are an expert technical interviewer helping a candidate prepare for interviews in ${subject}.
Focus areas: ${topic}.

${resumeText ? `Candidate's Background:\n${resumeText}\n\n` : ""}

Your job is to:
1. Ask targeted technical questions about ${topic}
2. Provide hints if the candidate struggles
3. Explain concepts clearly when needed
4. Give constructive feedback
5. Be conversatinal, keep responses brief, and wait for the candidate's answer before proceeding.

Start by introducing the topic and asking the first question.`;

      setVoiceContext({
        systemPrompt,
        context: {
          interviewId: id,
          subject,
          topic,
          resumeText,
          mode: "prepare",
          interviewMode: "interactive",
        },
      });
    } else {
      // Text mode
      setCurrentQuestion(firstQuestion);
      setQuestionIndex(1);
      setHistory([]);
    }

    setView("new-interview");
    // optimistic list entry
    setSessions((prev) => [
      {
        _id: id,
        mode: "prepare",
        interviewMode: mode || "analytic",
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
    const finalScore = Number.isFinite(sc) ? sc : 0;
    setSessions((prev) =>
      prev.map((iv) =>
        iv._id === interviewId
          ? { ...iv, score: finalScore, status: "completed" }
          : iv,
      ),
    );

    if (fb === null) {
      setView("empty");
      return;
    }

    setFeedback(fb);
    setScore(finalScore);
    setView("new-feedback");
  };

  const handleDeleteSession = async (id) => {
    try {
      await deleteLiveInterview(id);
      setSessions((prev) => prev.filter((iv) => iv._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedSession(null);
        setView("empty");
      }
      toast.success("Session deleted.");
    } catch {
      toast.error("Failed to delete session.");
    }
  };

  const handleRetry = () => handleNew();

  const handleAnalyze = async () => {
    if (!interviewId) return;
    // Switch to detail view and load the completed session
    setSelectedId(interviewId);
    setView("detail");
    setDetailLoading(true);
    try {
      const iv = await getLiveInterviewById(interviewId);
      setSelectedSession(iv);
    } catch {
      toast.error("Failed to load session.");
    } finally {
      setDetailLoading(false);
    }
  };

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
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div
        className={`flex-1 p-4 md:p-6 lg:p-8 ${view === "new-interview" ? "flex flex-col min-h-0 overflow-hidden" : "overflow-y-auto"}`}
      >
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
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 flex items-center gap-2 mb-6 text-xs flex-wrap">
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

            <div className="flex-1 min-h-0">
              {interviewMode === "interactive" && voiceContext ? (
                <VoiceInterviewAgent
                  interviewId={interviewId}
                  systemPrompt={voiceContext.systemPrompt}
                  context={voiceContext.context}
                  onEnd={handleEnd}
                />
              ) : (
                <InterviewChat
                  interviewId={interviewId}
                  currentQuestion={currentQuestion}
                  questionIndex={questionIndex}
                  history={history}
                  onAnswer={handleAnswer}
                  onEnd={handleEnd}
                />
              )}
            </div>
          </div>
        )}

        {view === "new-feedback" && (
          <InterviewFeedback
            feedback={feedback}
            score={score}
            onRetry={handleRetry}
            onAnalyze={handleAnalyze}
          />
        )}
      </div>
    </div>
  );
}
