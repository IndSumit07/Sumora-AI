import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  BarChart2,
  Loader2,
  Upload,
  X,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  User,
  Trash2,
  Link,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import { useAuth } from "../../../context/AuthContext";
import useServiceExitGuard from "../../../hooks/useServiceExitGuard";
import ServiceExitConfirmModal from "../../ServiceExitConfirmModal";
import { TokenConfirmModal } from "../../TokenConfirmModal";

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
      <svg
        width="110"
        height="110"
        viewBox="0 0 100 100"
        className="text-gray-900 dark:text-white"
      >
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

// ── Progress bar component ─────────────────────────────────────────────────────

const ProgressBar = ({ score, label, color = "#ea580c" }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      <span
        className="text-xs font-semibold"
        style={{ color }}
      >
        {score}/100
      </span>
    </div>
    <div className="h-2 rounded-full bg-gray-200 dark:bg-[#2a2a2a] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: color }}
      />
    </div>
  </div>
);

const sectionColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

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
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const atsIssues = report.atsCompatibility?.issues || [];
  const matching = report.keywordAnalysis?.matchedKeywords || [];
  const missing = report.keywordAnalysis?.missingKeywords || [];
  const overused = report.keywordAnalysis?.overusedKeywords || [];
  const cq = report.contentQuality || {};
  const gaps = report.skillGaps || [];
  const plan = report.preparationPlan || [];
  const suggestions = report.atsResumeSuggestions || [];
  const rm = report.roleMatch || {};

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] mb-2">
              Resume Analysis
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-snug mb-1">
              {report.title || report.role || "Resume Analysis"}
            </h2>
            {report.role && report.role !== report.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {report.role}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
              <Calendar size={11} />
              Generated {date}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <MatchScoreRing score={report.matchScore ?? 0} />
          </div>
        </div>
      </div>

      {/* Section Scores */}
      <Section
        title="Section-by-Section Scores"
        badge={`${(report.sectionScores || []).length} sections`}
        icon={BarChart2}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(report.sectionScores || []).map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4"
            >
              <ProgressBar
                label={s.name}
                score={s.score ?? 0}
                color={sectionColor(s.score ?? 0)}
              />
              {s.feedback && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {s.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ATS Compatibility */}
      <Section
        title="ATS Compatibility"
        badge={`${report.atsCompatibility?.overallScore ?? 0}/100`}
        icon={FileText}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <ProgressBar
                label="ATS Parsing Score"
                score={report.atsCompatibility?.overallScore ?? 0}
                color={sectionColor(report.atsCompatibility?.overallScore ?? 0)}
              />
            </div>
            <div className="flex-1 rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <ProgressBar
                label="Readability"
                score={report.atsCompatibility?.readability ?? 0}
                color={sectionColor(report.atsCompatibility?.readability ?? 0)}
              />
            </div>
          </div>
          {report.atsCompatibility?.keywordDensity && (
            <div className="rounded-xl border border-gray-100 dark:border-[#222] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Keyword Density
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {report.atsCompatibility.keywordDensity}
              </p>
            </div>
          )}
          {atsIssues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Parsing Issues Found ({atsIssues.length})
              </p>
              {atsIssues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-[#222] p-3 bg-white dark:bg-[#161616]"
                >
                  <span
                    className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      issue.severity === "high"
                        ? "bg-red-500"
                        : issue.severity === "medium"
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {issue.issue}
                    </p>
                    {issue.fix && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Fix: {issue.fix}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Keyword Analysis */}
      <Section
        title="Keyword Analysis"
        badge={`${matching.length} matched · ${missing.length} missing`}
        icon={CheckCircle2}
      >
        <div className="space-y-4">
          {matching.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                Matched Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {matching.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20"
                  >
                    {k.keyword}
                    {k.relevance === "high" && (
                      <span className="ml-1 opacity-60">★</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
          {missing.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                Missing Keywords — Add These
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((k, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                      k.relevance === "high"
                        ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        : k.relevance === "medium"
                          ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                          : "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"
                    }`}
                  >
                    {k.keyword}
                    {k.relevance === "high" && (
                      <span className="ml-1 opacity-60">★</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
          {overused.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                Overused Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {overused.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Content Quality */}
      <Section title="Content Quality" icon={User}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <ProgressBar
                label="Action Verb Usage"
                score={cq.actionVerbScore ?? 0}
                color={sectionColor(cq.actionVerbScore ?? 0)}
              />
            </div>
            <div className="flex-1 rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <ProgressBar
                label="Quantifiable Impact"
                score={cq.quantifiableScore ?? 0}
                color={sectionColor(cq.quantifiableScore ?? 0)}
              />
            </div>
          </div>
          {cq.strengths?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                Strengths
              </p>
              <ul className="space-y-1">
                {cq.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle2
                      size={13}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cq.weaknesses?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                Weaknesses
              </p>
              <ul className="space-y-1">
                {cq.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <AlertTriangle
                      size={13}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cq.redundancyFlags?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                Redundancy Detected
              </p>
              <ul className="space-y-1">
                {cq.redundancyFlags.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cq.overallAssessment && (
            <div className="rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Overall Content Assessment
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {cq.overallAssessment}
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* Skill Gaps */}
      <Section
        title="Skill Gaps & Learning Resources"
        badge={gaps.length}
        icon={AlertTriangle}
      >
        {gaps.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={16} /> No significant skill gaps — you&apos;re well-prepared!
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((sg, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#161616] p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {sg.skill}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      severityStyle[sg.severity] || severityStyle.medium
                    }`}
                  >
                    {sg.severity}
                  </span>
                </div>
                {sg.recommendation && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                    {sg.recommendation}
                  </p>
                )}
                {sg.learningResources?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ea580c] mb-1.5">
                      Learning Resources
                    </p>
                    <ul className="space-y-1">
                      {sg.learningResources.map((r, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ea580c] flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ATS Resume Suggestions */}
      <Section
        title="ATS-Optimized Rewrites"
        badge={`${suggestions.length} suggestions`}
        icon={FileText}
      >
        <div className="space-y-3">
          {suggestions.map((sug, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#161616] overflow-hidden"
            >
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {sug.section}
                </p>
                {sug.original && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">
                      Current
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-red-50 dark:bg-red-500/5 rounded-lg p-2.5 italic">
                      &ldquo;...{sug.original}...&rdquo;
                    </p>
                  </div>
                )}
                {sug.improved && (
                  <div className="mb-2">
                    <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wider mb-1">
                      Suggested
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-500/5 rounded-lg p-2.5">
                      {sug.improved}
                    </p>
                  </div>
                )}
                {sug.reason && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                    Why: {sug.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Role Match */}
      <Section title="Career Fit &amp; Role Match" icon={Briefcase}>
        <div className="space-y-4">
          {rm.levelAssessment && (
            <div className="rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Seniority Level
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {rm.levelAssessment}
              </p>
            </div>
          )}
          {rm.careerPath && (
            <div className="rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#0f0f0f] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Career Path
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {rm.careerPath}
              </p>
            </div>
          )}
          {rm.fittingRoles?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Other Fitting Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {rm.fittingRoles.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616]"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {r.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        (r.matchPercentage ?? 0) >= 75
                          ? "bg-green-50 text-green-700"
                          : (r.matchPercentage ?? 0) >= 50
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {r.matchPercentage ?? 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Preparation Roadmap */}
      <Section
        title="Preparation Roadmap"
        badge={`${plan.length} phases`}
        icon={CheckCircle2}
      >
        <div className="space-y-4">
          {plan.map((phase, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#161616] p-4"
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-[#ea580c] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {phase.phase}
                  </span>
                </div>
                {i < plan.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 dark:bg-[#333] mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {phase.focus}
                  </p>
                  {phase.duration && (
                    <span className="text-[10px] font-medium text-[#ea580c] bg-[#ea580c]/10 px-2 py-0.5 rounded-full">
                      {phase.duration}
                    </span>
                  )}
                </div>
                {phase.tasks?.length > 0 && (
                  <ul className="space-y-1 mb-2">
                    {phase.tasks.map((t, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {phase.milestones?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
                      Milestones
                    </p>
                    <ul className="space-y-0.5">
                      {phase.milestones.map((m, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-xs text-green-700 dark:text-green-400"
                        >
                          <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Download Resume PDF */}
      <div className="flex justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={pdfLoading}
          className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] disabled:opacity-50 transition-all"
        >
          {pdfLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Generating PDF&hellip;
            </>
          ) : (
            <>
              <Download size={15} /> Download ATS-Optimized Resume PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── History card (left panel) ─────────────────────────────────────────────────

const ReportCard = ({ report, active, onClick, onDelete }) => {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, badge } = scoreConfig(report.matchScore ?? 0);

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
          onDelete(report._id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        title="Delete"
      >
        <Trash2 size={12} />
      </button>

      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1 pr-5">
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
    </div>
  );
};

// ── Analysis form ─────────────────────────────────────────────────────────────

const isLinkedInJobUrl = (val) =>
  /linkedin\.com\/(jobs?|job-apply)\//i.test(val.trim());

const AnalysisForm = ({
  onReportGenerated,
  onBusyChange,
  onCancelRequestChange,
}) => {
  const { generateReport, fetchJobFromUrl } = useInterview();
  const { user } = useAuth();
  const tokensAvailable = user?.tokens || 0;
  const REPORT_COST = 25;

  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "text"
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchedCompany, setFetchedCompany] = useState("");
  const fileRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    onBusyChange?.(loading);
  }, [loading, onBusyChange]);

  useEffect(() => {
    if (!onCancelRequestChange) return undefined;

    onCancelRequestChange(() => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    });

    return () => {
      onCancelRequestChange(null);
    };
  }, [onCancelRequestChange]);

  const handleFetchJob = async () => {
    if (!isLinkedInJobUrl(linkedinUrl)) {
      toast.error("Please paste a valid LinkedIn job URL.");
      return;
    }
    setFetchLoading(true);
    try {
      const {
        role: r,
        company,
        jobDescription: jd,
      } = await fetchJobFromUrl(linkedinUrl);
      if (r) setRole(r);
      if (jd) setJobDescription(jd);
      if (company) setFetchedCompany(company);
      if (r || jd) {
        toast.success("Job details auto-filled from LinkedIn.");
      } else {
        toast.error("Could not extract details. Please fill in manually.");
      }
    } catch (err) {
      const msg =
        err.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : err.response?.data?.message || "Failed to fetch job details.";
      toast.error(msg);
    } finally {
      setFetchLoading(false);
    }
  };

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

  const handleSubmit = (e) => {
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
    setTokenModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setTokenModalOpen(false);
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const report = await generateReport(
        { role, jobDescription, selfDescription },
        resumeMode === "upload" ? resumeFile : null,
        controller.signal,
      );
      onReportGenerated(report);
    } catch (err) {
      if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") {
        toast("Analysis cancelled.");
        return;
      }
      toast.error(err.response?.data?.message || "Failed to generate report.");
    } finally {
      abortRef.current = null;
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
        {/* LinkedIn URL import */}
        <div className="rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#161616] p-4">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
            Import from LinkedIn{" "}
            <span className="normal-case font-normal">(optional)</span>
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !fetchLoading && handleFetchJob()
                }
                placeholder="Paste LinkedIn job URL…"
                className="h-9 w-full rounded-lg border border-gray-200 dark:border-[#333] pl-8 pr-3 text-xs bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleFetchJob}
              disabled={fetchLoading || !linkedinUrl.trim()}
              className="h-9 px-3 rounded-lg border border-gray-200 dark:border-[#333] text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] hover:border-[#ea580c]/50 hover:text-[#ea580c] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {fetchLoading ? (
                <>
                  <Loader2 size={11} className="animate-spin" /> Fetching…
                </>
              ) : (
                "Auto-fill"
              )}
            </button>
          </div>
          {fetchedCompany && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400">
              <CheckCircle2 size={11} />
              Auto-filled from{" "}
              <span className="font-semibold">{fetchedCompany}</span> · Edit
              fields below as needed.
            </p>
          )}
        </div>

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

      <TokenConfirmModal
        open={tokenModalOpen}
        cost={REPORT_COST}
        tokens={tokensAvailable}
        confirming={loading}
        onCancel={() => setTokenModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        serviceName="AI Analysis Report"
      />
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
  const { getAllReports, getReportById, generatePdf, deleteReport } =
    useInterview();

  const [reports, setReports] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // "empty" | "form" | "detail"
  const [view, setView] = useState("form");
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(true);
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const cancelAnalysisRef = useRef(null);

  const analysisActive = view === "form" && analysisRunning;

  const closeActiveAnalysis = useCallback(async () => {
    cancelAnalysisRef.current?.();
  }, []);

  const { isOpen, isConfirming, requestExit, confirmExit, cancelExit } =
    useServiceExitGuard({
      when: analysisActive,
      onConfirmExit: closeActiveAnalysis,
    });

  useEffect(() => {
    getAllReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    if (["form", "detail"].includes(view)) {
      setMobileHistoryOpen(false);
    }
  }, [view]);

  const openReportDetail = async (id) => {
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

  const handleSelectReport = (id) => {
    requestExit(() => {
      void openReportDetail(id);
    });
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

  const handleDeleteReport = async (id) => {
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedReport(null);
        setView("empty");
      }
      toast.success("Report deleted.");
    } catch {
      toast.error("Failed to delete report.");
    }
  };

  const handleCancelRequestChange = useCallback((cancelFn) => {
    cancelAnalysisRef.current = cancelFn;
  }, []);

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
    <div className="flex h-full overflow-hidden flex-col md:flex-row">
      {/* ── Mobile section sidebar (left drawer) ── */}
      <div
        className={[
          "md:hidden fixed inset-0 bg-black/30 z-30 transition-opacity",
          mobileHistoryOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileHistoryOpen(false)}
      />
      <aside
        className={[
          "md:hidden fixed top-11 bottom-0 left-0 z-40 w-[84%] max-w-xs",
          "bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222]",
          "transition-transform duration-200 flex flex-col",
          mobileHistoryOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Analyses
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileHistoryOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-100 dark:border-[#222]">
          <button
            type="button"
            onClick={() => {
              setMobileHistoryOpen(false);
              handleNew();
            }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Plus size={14} /> New Analysis
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
            </div>
          ) : (
            <div className="space-y-0.5">
              {reports.map((r) => (
                <ReportCard
                  key={r._id}
                  report={r}
                  active={selectedId === r._id}
                  onClick={() => {
                    setMobileHistoryOpen(false);
                    handleSelectReport(r._id);
                  }}
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

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
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="md:hidden flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMobileHistoryOpen((v) => !v)}
            className="h-9 px-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
          >
            {mobileHistoryOpen ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            Sidebar
          </button>
          <button
            type="button"
            onClick={handleNew}
            className="h-9 px-3 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors flex items-center gap-1.5"
          >
            <Plus size={13} /> New
          </button>
        </div>

        {view === "empty" && <EmptyPanel onNew={handleNew} />}

        {view === "form" && (
          <AnalysisForm
            onReportGenerated={handleReportGenerated}
            onBusyChange={setAnalysisRunning}
            onCancelRequestChange={handleCancelRequestChange}
          />
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

      <ServiceExitConfirmModal
        open={isOpen}
        title="Cancel analysis?"
        description="Your report is still generating. If you leave now, the current analysis request will be cancelled."
        confirmLabel="Cancel Analysis"
        cancelLabel="Keep Generating"
        confirming={isConfirming}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
    </div>
  );
}
