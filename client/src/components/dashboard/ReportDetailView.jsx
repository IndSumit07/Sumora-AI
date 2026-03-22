import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Pencil,
  Trash2,
  Plus,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { useInterview } from "../../context/InterviewContext";
import toast from "react-hot-toast";

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const scoreColor = (s) =>
  s >= 75 ? "#16a34a" : s >= 50 ? "#d97706" : "#dc2626";
const scoreLabel = (s) =>
  s >= 75 ? "Strong Match" : s >= 50 ? "Moderate Match" : "Weak Match";

const severityConfig = {
  low: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-400",
    dot: "bg-green-500",
    label: "Low",
  },
  medium: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Medium",
  },
  high: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    label: "High",
  },
};

/* ── Match Score Circle ───────────────────────────────────────────────────── */
const MatchScoreCircle = ({ score, size = 96 }) => {
  const r = size === 96 ? 38 : 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  const color = scoreColor(score);
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={size === 96 ? 8 : 6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size === 96 ? 8 : 6}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-tight">
        <span
          className={`font-bold text-gray-900 dark:text-gray-100 ${size === 96 ? "text-xl" : "text-sm"}`}
        >
          {score}
        </span>
        <span className="text-[9px] text-gray-400 dark:text-gray-500">
          / 100
        </span>
      </div>
    </div>
  );
};

/* ── Question Accordion ───────────────────────────────────────────────────── */
const QuestionAccordion = ({ items }) => {
  const [openIdx, setOpenIdx] = useState(null);
  if (!items?.length)
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">
        No questions available.
      </p>
    );
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-start justify-between px-4 py-3.5 text-left hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#202020] transition-colors gap-3"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
              {item.question}
            </span>
            <ChevronDown
              size={15}
              className={`text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a]/50">
              <p className="mt-3 mb-1 text-[11px] font-semibold text-[#ea580c] uppercase tracking-wider">
                Why they ask this
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                {item.intention}
              </p>
              <p className="mb-1 text-[11px] font-semibold text-[#ea580c] uppercase tracking-wider">
                How to answer
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Section Wrapper ──────────────────────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm">
    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {title}
    </h2>
    {children}
  </div>
);

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-6">
      <div className="h-6 bg-gray-200 dark:bg-[#222] rounded w-1/2 mb-3" />
      <div className="h-4 bg-gray-100 dark:bg-[#1a1a1a] rounded w-1/3 mb-6" />
      <div className="h-10 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl w-40" />
    </div>
    {[1, 2].map((k) => (
      <div
        key={k}
        className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-5"
      >
        <div className="h-4 bg-gray-200 dark:bg-[#222] rounded w-1/3 mb-4" />
        {[1, 2, 3].map((j) => (
          <div
            key={j}
            className="h-12 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl mb-2"
          />
        ))}
      </div>
    ))}
  </div>
);

/* ── Input style shared by modal ─────────────────────────────────────────── */
const modalInputCls =
  "w-full rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

/* ── Main Component ───────────────────────────────────────────────────────── */
const ReportDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getSessionById,
    generateReport,
    generatePdf,
    deleteSession,
    updateSession,
  } = useInterview();

  const [session, setSession] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Generate report modal
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [genResumeFile, setGenResumeFile] = useState(null);
  const [genDragging, setGenDragging] = useState(false);
  const genFileRef = useRef(null);

  // Delete modal
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editJobDesc, setEditJobDesc] = useState("");
  const [editSelfDesc, setEditSelfDesc] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const activeReport = reports.find((r) => r._id === activeReportId) ?? null;

  const load = () => {
    setLoading(true);
    getSessionById(id)
      .then(({ session: s, reports: rArr }) => {
        setSession(s);
        setReports(rArr ?? []);
      })
      .catch(() => {
        toast.error("Could not load session");
        navigate("/dashboard", { replace: true });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleGenerate = async (resumeFile = null) => {
    setGenModalOpen(false);
    setGenResumeFile(null);
    setGenerating(true);
    try {
      const newReport = await generateReport(id, resumeFile);
      setReports((prev) => [newReport, ...prev]);
      setActiveReportId(newReport._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenResumeFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File must be under 3 MB");
      return;
    }
    setGenResumeFile(file);
  };

  const handleGeneratePdf = async () => {
    if (!activeReport) return;
    setPdfLoading(true);
    try {
      await generatePdf(activeReport._id);
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteSession(id);
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Failed to delete session");
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editJobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!editJobDesc.trim()) {
      toast.error("Job description is required");
      return;
    }
    if (!editSelfDesc.trim()) {
      toast.error("Self description is required");
      return;
    }
    setEditLoading(true);
    try {
      const updated = await updateSession(id, {
        title: editTitle.trim(),
        jobTitle: editJobTitle.trim(),
        jobDescription: editJobDesc.trim(),
        selfDescription: editSelfDesc.trim(),
      });
      setSession((prev) => ({ ...prev, ...updated }));
      setEditOpen(false);
      toast.success("Session updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update session");
    } finally {
      setEditLoading(false);
    }
  };

  const openEdit = () => {
    setEditTitle(session.title);
    setEditJobTitle(session.jobTitle ?? "");
    setEditJobDesc(session.jobDescription);
    setEditSelfDesc(session.selfDescription ?? "");
    setEditOpen(true);
  };

  if (loading) return <Skeleton />;
  if (!session) return null;

  /* ── Report Detail View ─────────────────────────────────────────────────── */
  if (activeReport) {
    return (
      <div className="flex flex-col gap-5">
        <button
          onClick={() => setActiveReportId(null)}
          className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors w-fit"
        >
          <ArrowLeft size={15} /> Back to reports
        </button>

        {/* Report header card */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-snug">
                {activeReport.title ?? session.jobTitle}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Generated{" "}
                {new Date(activeReport.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: scoreColor(activeReport.matchScore) }}
              >
                {scoreLabel(activeReport.matchScore)}
              </p>
            </div>
            <MatchScoreCircle score={activeReport.matchScore} />
          </div>
        </div>

        {/* Technical Questions */}
        <Section
          title={`Technical Questions (${activeReport.technicalQuestions?.length ?? 0})`}
        >
          <QuestionAccordion items={activeReport.technicalQuestions} />
        </Section>

        {/* Behavioral Questions */}
        <Section
          title={`Behavioural Questions (${activeReport.behavioralQuestions?.length ?? 0})`}
        >
          <QuestionAccordion items={activeReport.behavioralQuestions} />
        </Section>

        {/* Skill Gaps */}
        <Section title={`Skill Gaps (${activeReport.skillGaps?.length ?? 0})`}>
          {!activeReport.skillGaps?.length ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No skill gaps identified — great match!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeReport.skillGaps.map((g, i) => {
                const cfg = severityConfig[g.severity] ?? severityConfig.medium;
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`}
                    />
                    {g.skill}
                    <span className="opacity-60">· {cfg.label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </Section>

        {/* Preparation Plan */}
        <Section
          title={`Preparation Plan (${activeReport.preparationPlan?.length ?? 0} days)`}
        >
          {!activeReport.preparationPlan?.length ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No preparation plan available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeReport.preparationPlan.map((day) => (
                <div
                  key={day.day}
                  className="border border-gray-100 dark:border-[#2a2a2a] rounded-xl p-4 bg-gray-50 dark:bg-[#1a1a1a]/60"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-[#ea580c]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#ea580c] text-[11px] font-bold">
                        {day.day}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {day.focus}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {day.tasks.map((task, ti) => (
                      <li
                        key={ti}
                        className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* New session CTA */}
        <div className="flex justify-center pb-4">
          <Link
            to="/dashboard/new"
            className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-[#ea580c] transition-colors"
          >
            <Sparkles size={13} /> Start a new session
          </Link>
        </div>
      </div>
    );
  }

  /* ── Session Overview + Reports List ──────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-5">
      {/* Session header card */}
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                {session.title}
              </h1>
              {session.jobTitle && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ea580c]/10 text-[#ea580c] font-medium">
                  {session.jobTitle}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              Created{" "}
              {new Date(session.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button
              onClick={openEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#333] text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-500/30 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Generate Report button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Reports{" "}
          <span className="text-gray-400 dark:text-gray-500 font-normal">
            ({reports.length})
          </span>
        </h2>
        <button
          onClick={() => setGenModalOpen(true)}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] disabled:opacity-60 disabled:pointer-events-none transition-colors"
        >
          {generating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating…
            </>
          ) : (
            <>
              <Plus size={15} /> Generate Report
            </>
          )}
        </button>
      </div>

      {/* No reports empty state */}
      {reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center">
            <Sparkles size={24} className="text-[#ea580c]" />
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            No reports yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-xs">
            Click "Generate Report" above to create your first AI-powered
            interview prep report.
          </p>
        </div>
      )}

      {/* Reports grid */}
      {reports.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, idx) => (
            <div
              key={report._id}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm flex flex-col gap-4"
            >
              {/* Score + badge */}
              <div className="flex items-center justify-between">
                <MatchScoreCircle score={report.matchScore} size={64} />
                <div className="text-right">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: scoreColor(report.matchScore) }}
                  >
                    {scoreLabel(report.matchScore)}
                  </p>
                  {idx === 0 && (
                    <span className="inline-block mt-1 text-[10px] bg-[#ea580c]/10 text-[#ea580c] px-2 py-0.5 rounded-full font-medium">
                      Latest
                    </span>
                  )}
                </div>
              </div>

              {/* Title + date */}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {report.title ?? session.jobTitle}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(report.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span>
                  {report.technicalQuestions?.length ?? 0} technical Q
                </span>
                <span className="w-px h-3 bg-gray-200 dark:bg-[#333]" />
                <span>{report.skillGaps?.length ?? 0} skill gaps</span>
              </div>

              {/* View button */}
              <button
                onClick={() => setActiveReportId(report._id)}
                className="w-full h-9 rounded-xl border border-[#ea580c]/40 text-sm font-medium text-[#ea580c] hover:bg-[#ea580c]/5 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleteLoading && setDeleteConfirm(false)}
          />
          <div className="relative bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-[#222] p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Delete session?
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              This will permanently delete{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                "{session.title}"
              </span>{" "}
              and all {reports.length} report{reports.length !== 1 ? "s" : ""}.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-[#333] text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 h-10 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !editLoading && setEditOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-[#222] p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">
              Edit Session
            </h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Session Title <span className="text-[#ea580c]">*</span>
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value.slice(0, 100))}
                  placeholder="Session title"
                  className={`${modalInputCls} h-11`}
                />
              </div>
              {/* Job Title */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Job Title <span className="text-[#ea580c]">*</span>
                </label>
                <input
                  value={editJobTitle}
                  onChange={(e) =>
                    setEditJobTitle(e.target.value.slice(0, 100))
                  }
                  placeholder="e.g. Senior Software Engineer"
                  className={`${modalInputCls} h-11`}
                />
              </div>
              {/* Job Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>
                    Job Description <span className="text-[#ea580c]">*</span>
                  </span>
                  <span className="font-normal text-gray-400 dark:text-gray-500 normal-case">
                    {editJobDesc.length} / 5000
                  </span>
                </label>
                <textarea
                  value={editJobDesc}
                  onChange={(e) =>
                    setEditJobDesc(e.target.value.slice(0, 5000))
                  }
                  rows={5}
                  placeholder="Job description"
                  className={`${modalInputCls} py-3 resize-none`}
                />
              </div>
              {/* Self Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>
                    Self Description <span className="text-[#ea580c]">*</span>
                  </span>
                  <span className="font-normal text-gray-400 dark:text-gray-500 normal-case">
                    {editSelfDesc.length} / 2000
                  </span>
                </label>
                <textarea
                  value={editSelfDesc}
                  onChange={(e) =>
                    setEditSelfDesc(e.target.value.slice(0, 2000))
                  }
                  rows={4}
                  placeholder="Your background, skills, experience…"
                  className={`${modalInputCls} py-3 resize-none`}
                />
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={editLoading}
                  className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-[#333] text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 h-10 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {editLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Generate Report Modal ──────────────────────────────────────────── */}
      {genModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setGenModalOpen(false);
              setGenResumeFile(null);
            }}
          />
          <div className="relative bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-[#222] p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Generate Report
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
              Upload your resume for a more accurate AI analysis. You can also
              skip and generate without one.
            </p>

            {/* File drop zone */}
            {genResumeFile ? (
              <div className="flex items-center justify-between px-4 py-3 mb-5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText
                    size={14}
                    className="text-green-600 dark:text-green-400 shrink-0"
                  />
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium truncate">
                    {genResumeFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGenResumeFile(null)}
                  className="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setGenDragging(true);
                }}
                onDragLeave={() => setGenDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setGenDragging(false);
                  handleGenResumeFile(e.dataTransfer.files[0]);
                }}
                onClick={() => genFileRef.current?.click()}
                className={`flex flex-col items-center justify-center py-8 mb-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  genDragging
                    ? "border-[#ea580c] bg-orange-50 dark:bg-[#ea580c]/10"
                    : "border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-[#1a1a1a]"
                }`}
              >
                <Upload
                  size={18}
                  className="text-gray-400 dark:text-gray-500 mb-2"
                />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Drop your resume or{" "}
                  <span className="text-[#ea580c] font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  PDF only · max 3 MB
                </p>
                <input
                  ref={genFileRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => handleGenResumeFile(e.target.files[0])}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleGenerate(null)}
                className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-[#333] text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => handleGenerate(genResumeFile)}
                className="flex-1 h-10 rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                {genResumeFile ? "Generate with Resume" : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailView;
