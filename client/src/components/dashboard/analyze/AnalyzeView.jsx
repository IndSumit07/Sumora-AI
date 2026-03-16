import { useEffect, useRef, useState } from "react";
import {
  Plus,
  BarChart2,
  Loader2,
  Upload,
  X,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";

// ── Score ring ────────────────────────────────────────────────────────────────

const RADIUS = 42;
const CIRC = 2 * Math.PI * RADIUS;

const scoreConfig = (s) => {
  if (s >= 75)
    return {
      stroke: "#22c55e",
      label: "Strong Match",
      badge: "bg-green-50 text-green-700",
    };
  if (s >= 50)
    return {
      stroke: "#f59e0b",
      label: "Good Match",
      badge: "bg-amber-50 text-amber-700",
    };
  return {
    stroke: "#ef4444",
    label: "Low Match",
    badge: "bg-red-50 text-red-600",
  };
};

const MatchScoreRing = ({ score }) => {
  const { stroke, label, badge } = scoreConfig(score);
  const offset = CIRC - (score / 100) * CIRC;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 100 100" className="text-gray-900 dark:text-white">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <text
          x="50"
          y="47"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fontWeight="700"
          fill="currentColor"
        >
          {score}
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="#9ca3af"
        >
          / 100
        </text>
      </svg>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}
      >
        {label}
      </span>
    </div>
  );
};

// ── Question accordion ────────────────────────────────────────────────────────

const QuestionCard = ({ q, index, open, onToggle }) => (
  <div className="border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-3 p-4 text-left bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
          {q.question}
        </span>
      </div>
      {open ? (
        <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
      ) : (
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
      )}
    </button>
    {open && (
      <div className="px-4 pb-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-[#222] space-y-3">
        <div className="pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ea580c] mb-1">
            Why they ask this
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {q.intention}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            How to answer
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {q.answer}
          </p>
        </div>
      </div>
    )}
  </div>
);

// ── Section wrapper ───────────────────────────────────────────────────────────

const Section = ({ title, badge, icon: Icon, children }) => (
  <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#222]">
      <div className="flex items-center gap-2.5">
        <Icon size={16} className="text-[#ea580c]" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      {badge !== undefined && (
        <span className="text-xs font-medium bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

// ── Severity badge config ─────────────────────────────────────────────────────

const severityStyle = {
  low: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-600 border-red-200",
};

// ── Full report display ───────────────────────────────────────────────────────

const ReportDisplay = ({ report, onDownloadPdf, pdfLoading }) => {
  const [openTechIdx, setOpenTechIdx] = useState(null);
  const [openBehavIdx, setOpenBehavIdx] = useState(null);

  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] mb-2">
              Analysis Report
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-snug mb-1">
              {report.title || report.role || "Interview Analysis"}
            </h2>
            {report.role && report.role !== report.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{report.role}</p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
              <Calendar size={11} />
              Generated {date}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <MatchScoreRing score={report.matchScore ?? 0} />
            <button
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-black/8 hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white text-sm font-medium transition-colors disabled:opacity-50 border border-black/10 dark:border-white/10"
            >
              {pdfLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              Download Resume PDF
            </button>
          </div>
        </div>
      </div>

      {/* Technical Questions */}
      <Section
        title="Technical Questions"
        badge={report.technicalQuestions?.length}
        icon={Briefcase}
      >
        <div className="space-y-3">
          {report.technicalQuestions?.map((q, i) => (
            <QuestionCard
              key={i}
              q={q}
              index={i}
              open={openTechIdx === i}
              onToggle={() => setOpenTechIdx(openTechIdx === i ? null : i)}
            />
          ))}
        </div>
      </Section>

      {/* Behavioral Questions */}
      <Section
        title="Behavioral Questions"
        badge={report.behavioralQuestions?.length}
        icon={User}
      >
        <div className="space-y-3">
          {report.behavioralQuestions?.map((q, i) => (
            <QuestionCard
              key={i}
              q={q}
              index={i}
              open={openBehavIdx === i}
              onToggle={() => setOpenBehavIdx(openBehavIdx === i ? null : i)}
            />
          ))}
        </div>
      </Section>

      {/* Skill Gaps */}
      <Section
        title="Skill Gaps"
        badge={report.skillGaps?.length}
        icon={AlertTriangle}
      >
        {report.skillGaps?.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={16} /> No significant skill gaps identified!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {report.skillGaps?.map((sg, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${severityStyle[sg.severity] || severityStyle.medium}`}
              >
                {sg.skill}
                <span className="opacity-60 capitalize">· {sg.severity}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Preparation Plan */}
      <Section
        title="Preparation Plan"
        badge={`${report.preparationPlan?.length} days`}
        icon={CheckCircle2}
      >
        <div className="space-y-3">
          {report.preparationPlan?.map((day, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-[#ea580c] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {day.day}
                  </span>
                </div>
                {i < report.preparationPlan.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 dark:bg-[#333] mt-1" />
                )}
              </div>
              <div className="pb-5 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {day.focus}
                </p>
                <ul className="space-y-1.5">
                  {day.tasks?.map((task, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ── History card (left panel) ─────────────────────────────────────────────────

const ReportCard = ({ report, active, onClick }) => {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, badge } = scoreConfig(report.matchScore ?? 0);

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
        {report.title || report.role || "Analysis Report"}
      </p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Calendar size={10} /> {date}
        </span>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge}`}
        >
          {report.matchScore ?? 0} · {label}
        </span>
      </div>
    </button>
  );
};

// ── Analysis form ─────────────────────────────────────────────────────────────

const AnalysisForm = ({ onReportGenerated }) => {
  const { generateReport } = useInterview();
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "text"
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File must be under 3 MB.");
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.error("Job description is required.");
      return;
    }
    if (resumeMode === "upload" && !resumeFile) {
      toast.error("Please upload a PDF resume.");
      return;
    }
    if (resumeMode === "text" && !resumeText.trim()) {
      toast.error("Please paste your resume text.");
      return;
    }

    setLoading(true);
    try {
      const report = await generateReport(
        { role, jobDescription, selfDescription },
        resumeMode === "upload" ? resumeFile : null,
      );
      onReportGenerated(report);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
          <BarChart2 size={16} className="text-[#ea580c]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Analysis
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Gemini AI will analyze your resume fit, surface skill gaps, and
            generate a prep plan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Role / Position{" "}
            <span className="normal-case font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Backend Engineer, Data Scientist…"
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
            <span className="text-[11px] text-gray-400">
              {jobDescription.length}/5000
            </span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            rows={5}
            maxLength={5000}
            required
            className="w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] px-4 py-3 text-sm bg-white dark:bg-[#161616] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all resize-none"
          />
        </div>

        {/* Resume */}
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-5">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Your Resume
          </p>

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#222] p-1 mb-4 gap-1">
            {[
              { id: "upload", label: "Upload PDF" },
              { id: "text", label: "Paste Text" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setResumeMode(id)}
                className={[
                  "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                  resumeMode === id
                    ? "bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {resumeMode === "upload" ? (
            <div
              onClick={() => fileRef.current?.click()}
              className={[
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors",
                resumeFile
                  ? "border-[#ea580c]/40 bg-[#ea580c]/5"
                  : "border-gray-200 dark:border-[#2a2a2a] hover:border-[#ea580c]/40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
              ].join(" ")}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {resumeFile ? (
                <>
                  <div className="h-10 w-10 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
                    <FileText size={20} className="text-[#ea580c]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(resumeFile.size / 1024).toFixed(0)} KB · Click to change
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload PDF
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      PDF up to 3 MB
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume content here…"
              rows={10}
              maxLength={5000}
              className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none"
            />
          )}
        </div>

        {/* Self description */}
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              About You
            </p>
            <span className="text-xs text-gray-400">Optional</span>
          </div>
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            placeholder="Briefly describe your background, years of experience, key skills…"
            rows={4}
            maxLength={2000}
            className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {selfDescription.length}/2000
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Generating report —
              this may take ~30 seconds…
            </>
          ) : (
            "Generate AI Report →"
          )}
        </button>
      </form>
    </div>
  );
};

// ── Empty right panel ─────────────────────────────────────────────────────────

const EmptyPanel = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <div className="h-14 w-14 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
      <BarChart2 size={24} className="text-[#ea580c]" />
    </div>
    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      No report selected
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 max-w-xs">
      Select a past analysis from the list or generate a new one.
    </p>
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
    >
      <Plus size={14} /> New Analysis
    </button>
  </div>
);

// ── Main AnalyzeView ──────────────────────────────────────────────────────────

export default function AnalyzeView() {
  const { getAllReports, getReportById, generatePdf } = useInterview();

  const [reports, setReports] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // "empty" | "form" | "detail"
  const [view, setView] = useState("empty");
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    getAllReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, []);

  const handleSelectReport = async (id) => {
    setSelectedId(id);
    setView("detail");
    setDetailLoading(true);
    try {
      const r = await getReportById(id);
      setSelectedReport(r);
    } catch {
      toast.error("Failed to load report.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setSelectedReport(null);
    setView("form");
  };

  const handleReportGenerated = (report) => {
    setReports((prev) => [
      {
        _id: report._id,
        title: report.title,
        role: report.role,
        matchScore: report.matchScore,
        createdAt: report.createdAt,
      },
      ...prev,
    ]);
    setSelectedReport(report);
    setSelectedId(report._id);
    setView("detail");
  };

  const handleDownloadPdf = async () => {
    if (!selectedReport) return;
    setPdfLoading(true);
    try {
      await generatePdf(selectedReport._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left history panel ── */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Analyses
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            title="New Analysis"
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
          ) : reports.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No analyses yet.
              </p>
              <button
                type="button"
                onClick={handleNew}
                className="mt-3 text-xs font-medium text-[#ea580c] hover:underline"
              >
                Generate your first one
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {reports.map((r) => (
                <ReportCard
                  key={r._id}
                  report={r}
                  active={selectedId === r._id}
                  onClick={() => handleSelectReport(r._id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {view === "empty" && <EmptyPanel onNew={handleNew} />}

        {view === "form" && (
          <AnalysisForm onReportGenerated={handleReportGenerated} />
        )}

        {view === "detail" &&
          (detailLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            </div>
          ) : selectedReport ? (
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleNew}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#ea580c] text-xs font-medium text-white hover:bg-[#d24e0b] transition-colors"
                >
                  <Plus size={13} /> New Analysis
                </button>
              </div>
              <ReportDisplay
                report={selectedReport}
                onDownloadPdf={handleDownloadPdf}
                pdfLoading={pdfLoading}
              />
            </div>
          ) : null)}
      </div>
    </div>
  );
}
