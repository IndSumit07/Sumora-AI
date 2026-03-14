import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Sparkles,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { useInterview } from "../../context/InterviewContext";
import toast from "react-hot-toast";

/* ── helpers ── */
const scoreColor = (s) =>
  s >= 75 ? "#16a34a" : s >= 50 ? "#d97706" : "#dc2626";
const scoreLabel = (s) =>
  s >= 75 ? "Strong Match" : s >= 50 ? "Moderate Match" : "Weak Match";

const severityConfig = {
  low:    { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500",  label: "Low" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500",  label: "Medium" },
  high:   { bg: "bg-red-100",   text: "text-red-700",   dot: "bg-red-500",    label: "High" },
};

/* ── Match Score Circle ── */
const MatchScoreCircle = ({ score }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="-rotate-90" width={96} height={96}>
        <circle cx={48} cy={48} r={r} fill="none" stroke="#f3f4f6" strokeWidth={8} />
        <circle
          cx={48} cy={48} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-tight">
        <span className="text-xl font-bold text-gray-900">{score}</span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
};

/* ── Question Accordion ── */
const QuestionAccordion = ({ items }) => {
  const [openIdx, setOpenIdx] = useState(null);
  if (!items?.length) return <p className="text-sm text-gray-400">No questions available.</p>;
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-start justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors gap-3"
          >
            <span className="text-sm font-medium text-gray-900 leading-snug">{item.question}</span>
            <ChevronDown
              size={15}
              className={`text-gray-400 shrink-0 mt-0.5 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
              <p className="mt-3 mb-1 text-[11px] font-semibold text-[#ea580c] uppercase tracking-wider">Why they ask this</p>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.intention}</p>
              <p className="mb-1 text-[11px] font-semibold text-[#ea580c] uppercase tracking-wider">How to answer</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Section Wrapper ── */
const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
    <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

/* ── Skeleton ── */
const Skeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mb-6" />
      <div className="h-24 w-24 rounded-full bg-gray-200" />
    </div>
    {[1, 2].map((k) => (
      <div key={k} className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        {[1, 2, 3].map((j) => <div key={j} className="h-12 bg-gray-100 rounded-xl mb-2" />)}
      </div>
    ))}
  </div>
);

/* ── Inline Generate Form (no new session needed) ── */
const MODES = { upload: "upload", text: "text" };

const GenerateReportForm = ({ session, onSuccess }) => {
  const { generateReport } = useInterview();
  const [resumeMode, setResumeMode] = useState(MODES.upload);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Only PDF files are supported"); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("File must be under 3 MB"); return; }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (resumeMode === MODES.upload && !resumeFile) { toast.error("Please upload your resume PDF"); return; }
    if (resumeMode === MODES.text && !resumeText.trim()) { toast.error("Please paste your resume text"); return; }
    if (!selfDescription.trim()) { toast.error("Self description is required"); return; }
    setLoading(true);
    try {
      await generateReport(
        session._id,
        resumeMode === MODES.upload ? resumeFile : null,
        resumeMode === MODES.text ? resumeText : "",
        selfDescription,
      );
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Session info banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#ea580c]/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-[#ea580c]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{session.title}</p>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{session.jobDescription}</p>
          </div>
        </div>
      </div>

      {/* Resume section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-900 mb-3">Your Resume</p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl w-fit">
          {[MODES.upload, MODES.text].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setResumeMode(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                resumeMode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {m === MODES.upload ? "Upload PDF" : "Paste Text"}
            </button>
          ))}
        </div>

        {resumeMode === MODES.upload ? (
          resumeFile ? (
            <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium truncate max-w-[200px]">{resumeFile.name}</span>
              </div>
              <button type="button" onClick={() => setResumeFile(null)} className="text-green-500 hover:text-green-700">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                dragging ? "border-[#ea580c] bg-orange-50" : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
              }`}
            >
              <Upload size={20} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drop your PDF here or <span className="text-[#ea580c] font-medium">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">PDF only · max 3 MB</p>
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          )
        ) : (
          <div className="relative">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value.slice(0, 5000))}
              rows={8}
              placeholder="Paste your resume here…"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none outline-none"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-gray-300">{resumeText.length}/5000</span>
          </div>
        )}
      </div>

      {/* Self Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          About You <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-400 mb-3">Share your experience, strengths, and anything you'd like the AI to factor in.</p>
        <div className="relative">
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value.slice(0, 2000))}
            rows={4}
            placeholder="e.g. 3 years of backend experience, strong in system design…"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none outline-none"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-gray-300">{selfDescription.length}/2000</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Generating report…
          </>
        ) : (
          <><Sparkles size={14} /> Generate Report</>
        )}
      </button>
    </form>
  );
};

/* ── Main Component ── */
const ReportDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSessionById, generatePdf } = useInterview();

  const [session, setSession]   = useState(null);
  const [report, setReport]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getSessionById(id)
      .then(({ session: s, report: r }) => { setSession(s); setReport(r); })
      .catch(() => { toast.error("Could not load session"); navigate("/dashboard/sessions", { replace: true }); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleDownloadPdf = async () => {
    if (!report) return;
    setPdfLoading(true);
    try { await generatePdf(report._id, session?.title); }
    catch { toast.error("Failed to generate PDF"); }
    finally { setPdfLoading(false); }
  };

  if (loading) return <Skeleton />;
  if (!session) return null;

  /* ── No report yet: show inline generate form ── */
  if (!report) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/dashboard/sessions")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft size={15} /> Back to sessions
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{session.title}</h1>
          <p className="mt-1 text-sm text-gray-400">No report yet — fill in your resume details below to generate one.</p>
        </div>
        <GenerateReportForm session={session} onSuccess={load} />
      </div>
    );
  }

  /* ── Report exists ── */
  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => navigate("/dashboard/sessions")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Back to sessions
      </button>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug">{session.title}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {new Date(session.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: scoreColor(report.matchScore) }}>
              {scoreLabel(report.matchScore)}
            </p>
          </div>
          <MatchScoreCircle score={report.matchScore} />
        </div>
      </div>

      {/* Technical Questions */}
      <Section title={`Technical Questions (${report.technicalQuestions?.length ?? 0})`}>
        <QuestionAccordion items={report.technicalQuestions} />
      </Section>

      {/* Behavioral Questions */}
      <Section title={`Behavioural Questions (${report.behavioralQuestions?.length ?? 0})`}>
        <QuestionAccordion items={report.behavioralQuestions} />
      </Section>

      {/* Skill Gaps */}
      <Section title={`Skill Gaps (${report.skillGaps?.length ?? 0})`}>
        {!report.skillGaps?.length ? (
          <p className="text-sm text-gray-400">No skill gaps identified — great match!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {report.skillGaps.map((g, i) => {
              const cfg = severityConfig[g.severity] ?? severityConfig.medium;
              return (
                <span key={i} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  {g.skill}
                  <span className="opacity-60">· {cfg.label}</span>
                </span>
              );
            })}
          </div>
        )}
      </Section>

      {/* Preparation Plan */}
      <Section title={`Preparation Plan (${report.preparationPlan?.length ?? 0} days)`}>
        {!report.preparationPlan?.length ? (
          <p className="text-sm text-gray-400">No preparation plan available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.preparationPlan.map((day) => (
              <div key={day.day} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full bg-[#ea580c]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#ea580c] text-[11px] font-bold">{day.day}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{day.focus}</p>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {day.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
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

      {/* Generate PDF */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Generate Resume PDF</h2>
            <p className="mt-0.5 text-xs text-gray-400">AI-tailored resume for this job — ATS-friendly and ready to send.</p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#090909] text-sm font-medium text-white hover:bg-gray-800 transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
          >
            {pdfLoading ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Generating…</>
            ) : (
              <><Download size={14} />Download Resume PDF</>
            )}
          </button>
        </div>
      </div>

      {/* New session CTA */}
      <div className="flex justify-center pb-4">
        <Link to="/dashboard/new" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#ea580c] transition-colors">
          <Sparkles size={13} /> Start a new session
        </Link>
      </div>
    </div>
  );
};

export default ReportDetailView;
