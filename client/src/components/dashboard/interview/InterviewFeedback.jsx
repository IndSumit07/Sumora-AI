/**
 * InterviewFeedback.jsx
 *
 * Phase 3 UI: display structured AI feedback after the interview ends.
 *
 * Props:
 *   feedback — {
 *     technicalScore:     number (0-10)
 *     communicationScore: number (0-10)
 *     strengths:          string[]
 *     weaknesses:         string[]
 *     improvements:       string[]
 *   }
 *   score      — overall score (0-100, computed server-side)
 *   onRetry()  — called when the user wants to start a new interview
 */

import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

// ── Score ring ────────────────────────────────────────────────────────────────

const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

const ScoreRing = ({ value, max, label, color }) => {
  const pct = Math.min(1, Math.max(0, value / max));
  const offset = CIRC - pct * CIRC;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="90" height="90" viewBox="0 0 90 90" className="text-gray-900 dark:text-white">
        <circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="45"
          cy="45"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform="rotate(-90 45 45)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <text
          x="45"
          y="42"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
          fontWeight="700"
          fill="currentColor"
        >
          {value}
        </text>
        <text
          x="45"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#9ca3af"
        >
          / {max}
        </text>
      </svg>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

// ── List section ──────────────────────────────────────────────────────────────

const ListSection = ({ title, icon: Icon, iconColor, items, emptyText }) => (
  <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-[#222]">
      <Icon size={15} className={iconColor} />
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#2a2a2a] px-2 py-0.5 rounded-full">
        {items.length}
      </span>
    </div>
    <ul className="p-5 space-y-2.5">
      {items.length === 0 ? (
        <li className="text-sm text-gray-400 dark:text-gray-500">
          {emptyText}
        </li>
      ) : (
        items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ea580c] flex-shrink-0" />
            {item}
          </li>
        ))
      )}
    </ul>
  </div>
);

// ── Overall score badge ───────────────────────────────────────────────────────

const overallConfig = (s) => {
  if (s >= 70)
    return {
      label: "Strong Performance",
      color: "#22c55e",
      badgeClass: "bg-green-50 text-green-700",
    };
  if (s >= 45)
    return {
      label: "Good Performance",
      color: "#f59e0b",
      badgeClass: "bg-amber-50 text-amber-700",
    };
  return {
    label: "Needs Improvement",
    color: "#ef4444",
    badgeClass: "bg-red-50 text-red-600",
  };
};

// ── Main component ────────────────────────────────────────────────────────────

export default function InterviewFeedback({ feedback, score, onRetry }) {
  const { label, color, badgeClass } = overallConfig(score ?? 0);

  const techScore = feedback?.technicalScore ?? 0;
  const commScore = feedback?.communicationScore ?? 0;
  const strengths = feedback?.strengths || [];
  const weaknesses = feedback?.weaknesses || [];
  const improvements = feedback?.improvements || [];

  return (
    <div className="max-w-3xl space-y-5">
      {/* ── Header ── */}
      <div className="bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] mb-2">
            Interview Complete
          </p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Performance Report
          </h2>

          <div className="flex flex-wrap items-center gap-8">
            {/* Overall score */}
            <div className="flex flex-col items-center gap-2">
              <ScoreRing
                value={score ?? 0}
                max={100}
                label="Overall Score"
                color={color}
              />
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
              >
                {label}
              </span>
            </div>

            <div className="h-16 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

            {/* Sub-scores */}
            <div className="flex gap-6">
              <ScoreRing
                value={techScore}
                max={10}
                label="Technical"
                color="#ea580c"
              />
              <ScoreRing
                value={commScore}
                max={10}
                label="Communication"
                color="#a855f7"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Strengths ── */}
      <ListSection
        title="Strengths"
        icon={CheckCircle2}
        iconColor="text-green-500"
        items={strengths}
        emptyText="No specific strengths recorded."
      />

      {/* ── Weaknesses ── */}
      <ListSection
        title="Areas of Weakness"
        icon={AlertTriangle}
        iconColor="text-amber-500"
        items={weaknesses}
        emptyText="No significant weaknesses identified."
      />

      {/* ── Improvements ── */}
      <ListSection
        title="How to Improve"
        icon={TrendingUp}
        iconColor="text-[#ea580c]"
        items={improvements}
        emptyText="No specific improvement suggestions."
      />

      {/* ── Retry ── */}
      <button
        type="button"
        onClick={onRetry}
        className="w-full h-12 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-[#1e1e1e] flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} />
        Start Another Interview
      </button>
    </div>
  );
}
