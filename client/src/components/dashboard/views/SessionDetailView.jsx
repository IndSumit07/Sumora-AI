import { useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import InterviewHistoryView from "../interview/InterviewHistoryView";
import {
  ArrowLeft,
  Upload,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  Download,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useInterview } from "../../../context/InterviewContext";
import toast from "react-hot-toast";

// ── Match Score Ring ─────────────────────────────────────────────────────────

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
    badge: "bg-red-50   text-red-600",
  };
};

const MatchScoreRing = ({ score }) => {
  const { stroke, label, badge } = scoreConfig(score);
  const offset = CIRC - (score / 100) * CIRC;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="9"
        />
        {/* Arc */}
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
        {/* Score text */}
        <text
          x="50"
          y="47"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="22"
          fontWeight="700"
          fill="#111827"
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

// ── Question Accordion ────────────────────────────────────────────────────────

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
        <ChevronUp
          size={16}
          className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
        />
      ) : (
        <ChevronDown
          size={16}
          className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
        />
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
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">
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

// ── Report summary card ───────────────────────────────────────────────────────

const ReportCard = ({ report, onClick }) => {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, badge } = scoreConfig(report.matchScore ?? 0);

  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm hover:border-[#ea580c]/40 hover:shadow-md transition-all flex items-center gap-4"
    >
      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
        <span className="text-sm font-bold text-[#ea580c]">
          {report.matchScore ?? 0}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {report.title || "Interview Report"}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar size={11} />
            {date}
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}
          >
            {label}
          </span>
        </div>
      </div>

      <ChevronRight
        size={16}
        className="text-gray-300 dark:text-gray-600 group-hover:text-[#ea580c] transition-colors flex-shrink-0"
      />
    </button>
  );
};

// ── Severity badge ────────────────────────────────────────────────────────────

const severityStyle = {
  low: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50   text-red-600   border-red-200",
};

// ── Generate Report Form ──────────────────────────────────────────────────────

const GenerateReportForm = ({ session, onReportGenerated }) => {
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "text"
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { generateReport } = useInterview();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File must be under 3 MB");
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (resumeMode === "upload" && !resumeFile) {
      toast.error("Please upload a PDF resume");
      return;
    }
    if (resumeMode === "text" && !resumeText.trim()) {
      toast.error("Please paste your resume text");
      return;
    }
    setLoading(true);
    try {
      const report = await generateReport(
        session._id,
        resumeMode === "upload" ? resumeFile : null,
        resumeMode === "text" ? resumeText : "",
        selfDescription,
      );
      onReportGenerated(report);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Generate AI Report
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Provide your resume and a brief self-introduction. The AI will analyze
          your fit for the role and generate a personalized prep report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Resume section */}
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Your Resume
          </p>

          {/* Mode tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-[#222] p-1 mb-5 gap-1">
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
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {resumeMode === "upload" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={[
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors",
                resumeFile
                  ? "border-[#ea580c]/40 bg-[#ea580c]/5"
                  : "border-gray-200 dark:border-[#2a2a2a] hover:border-[#ea580c]/40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
              ].join(" ")}
            >
              <input
                ref={fileInputRef}
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
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {(resumeFile.size / 1024).toFixed(0)} KB · Click to change
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center">
                    <Upload
                      size={20}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload PDF
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
              className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none"
            />
          )}
        </div>

        {/* Self description */}
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Self Description
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Optional
            </span>
          </div>
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            placeholder="Briefly describe your background, years of experience, key skills, or anything else you'd like the AI to know…"
            rows={5}
            maxLength={2000}
            className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
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
              <Loader2 size={16} className="animate-spin" />
              <span>Generating report — this may take up to 30 seconds…</span>
            </>
          ) : (
            "Generate AI Report →"
          )}
        </button>
      </form>
    </div>
  );
};

// ── Full Report Display ───────────────────────────────────────────────────────

const ReportDisplay = ({ session, report, onDownloadPdf, pdfLoading }) => {
  const [openTechIdx, setOpenTechIdx] = useState(null);
  const [openBehavIdx, setOpenBehavIdx] = useState(null);

  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-5 max-w-4xl">
      {/* ── Report Header ─────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] mb-2">
              Interview Report
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-1">
              {report.title || session.title}
            </h2>
            {report.title && report.title !== session.title && (
              <p className="text-sm text-gray-400 mb-3">{session.title}</p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={11} />
              Generated {date}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <MatchScoreRing score={report.matchScore} />
            <button
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors disabled:opacity-50 border border-white/10"
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

      {/* ── Technical Questions ────────────────────────────────── */}
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

      {/* ── Behavioral Questions ──────────────────────────────── */}
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

      {/* ── Skill Gaps ────────────────────────────────────────── */}
      <Section
        title="Skill Gaps"
        badge={report.skillGaps?.length}
        icon={AlertTriangle}
      >
        {report.skillGaps?.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={16} />
            No significant skill gaps identified!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {report.skillGaps?.map((sg, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  severityStyle[sg.severity] || severityStyle.medium
                }`}
              >
                {sg.skill}
                <span className="opacity-60 capitalize">· {sg.severity}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Preparation Plan ──────────────────────────────────── */}
      <Section
        title="Preparation Plan"
        badge={`${report.preparationPlan?.length} days`}
        icon={CheckCircle2}
      >
        <div className="space-y-3">
          {report.preparationPlan?.map((day, i) => (
            <div key={i} className="flex gap-4">
              {/* Day indicator */}
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

              {/* Day content */}
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

// ── Main SessionDetailView ───────────────────────────────────────────────────

const SessionDetailView = () => {
  const { sessionId } = useParams();
  const { getSessionById, generatePdf } = useInterview();

  const [session, setSession] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportView, setReportView] = useState("list"); // "list" | "form" | "detail"
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("tab") || "reports";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessionById(sessionId);
        setSession(data.session);
        const list = data.reports || [];
        setReports(list);
        if (list.length === 0) setReportView("form");
      } catch {
        toast.error("Failed to load session");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      await generatePdf(
        selectedReport._id,
        selectedReport.title || session.title,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-[#ea580c]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Session not found.
        </p>
        <Link
          to="/dashboard/sessions"
          className="flex items-center gap-2 text-sm font-medium text-[#ea580c] hover:underline"
        >
          <ArrowLeft size={14} />
          Back to sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Session info card (always visible) */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm mb-5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-[#ea580c]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {session.title}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
              {session.jobDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Render active section */}
      {section === "reports" ? (
        reportView === "detail" && selectedReport ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setReportView("list");
                  setSelectedReport(null);
                }}
                className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                ← All Reports
              </button>
              <button
                type="button"
                onClick={() => setReportView("form")}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#ea580c] text-xs font-medium text-white hover:bg-[#d24e0b] transition-colors"
              >
                <Plus size={13} />
                New Report
              </button>
            </div>
            <ReportDisplay
              session={session}
              report={selectedReport}
              onDownloadPdf={handleDownloadPdf}
              pdfLoading={pdfLoading}
            />
          </div>
        ) : reportView === "form" ? (
          <div className="space-y-4">
            {reports.length > 0 && (
              <button
                type="button"
                onClick={() => setReportView("list")}
                className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                ← All Reports
              </button>
            )}
            <GenerateReportForm
              session={session}
              onReportGenerated={(newReport) => {
                setReports((prev) => [newReport, ...prev]);
                setSelectedReport(newReport);
                setReportView("detail");
              }}
            />
          </div>
        ) : (
          /* reportView === "list" */
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Reports
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {reports.length} report{reports.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReportView("form")}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
              >
                <Plus size={14} />
                New Report
              </button>
            </div>
            <div className="space-y-3">
              {reports.map((r) => (
                <ReportCard
                  key={r._id}
                  report={r}
                  onClick={() => {
                    setSelectedReport(r);
                    setReportView("detail");
                  }}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        <InterviewHistoryView session={session} />
      )}
    </div>
  );
};

export default SessionDetailView;
