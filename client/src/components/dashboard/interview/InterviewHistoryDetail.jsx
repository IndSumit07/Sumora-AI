/**
 * InterviewHistoryDetail.jsx
 *
 * Shows the full detail of a completed (or in-progress) live interview:
 *   - Header with scores
 *   - Full Q&A conversation accordion
 *   - Feedback sections (strengths, weaknesses, improvements)
 *
 * Props:
 *   interview — full LiveInterview document (with parsed feedback object)
 */

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Calendar,
} from "lucide-react";

// ── Score ring ────────────────────────────────────────────────────────────────

const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

const ScoreRing = ({ value, max, label, color }) => {
  const pct = Math.min(1, Math.max(0, value / max));
  const offset = CIRC - pct * CIRC;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width="84"
        height="84"
        viewBox="0 0 90 90"
        className="text-gray-900 dark:text-white"
      >
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
          fontSize="17"
          fontWeight="700"
          fill="currentColor"
        >
          {value}
        </text>
        <text
          x="45"
          y="57"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#9ca3af"
        >
          / {max}
        </text>
      </svg>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

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

// ── Q&A turn accordion ────────────────────────────────────────────────────────

const TurnCard = ({ turn, index, open, onToggle }) => (
  <div className="border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-3 p-4 text-left bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
          {turn.question}
        </span>
      </div>
      {open ? (
        <ChevronUp
          size={15}
          className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
        />
      ) : (
        <ChevronDown
          size={15}
          className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
        />
      )}
    </button>
    {open && (
      <div className="px-4 pb-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-[#222]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ea580c] mt-3 mb-1.5">
          Your Answer
        </p>
        {turn.answer?.trim() ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {turn.answer}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            No answer recorded.
          </p>
        )}
      </div>
    )}
  </div>
);

// ── Feedback list section ─────────────────────────────────────────────────────

const FeedbackSection = ({
  title,
  icon: Icon,
  iconColor,
  items,
  emptyText,
}) => (
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

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InterviewHistoryDetail({ interview }) {
  const [openIdx, setOpenIdx] = useState(null);

  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const feedback =
    interview.feedback && typeof interview.feedback === "object"
      ? interview.feedback
      : null;
  const score = interview.score ?? 0;
  const techScore = feedback?.technicalScore ?? 0;
  const commScore = feedback?.communicationScore ?? 0;
  const strengths = feedback?.strengths || [];
  const weaknesses = feedback?.weaknesses || [];
  const improvements = feedback?.improvements || [];
  const isCompleted = interview.status === "completed";

  const { label, color, badgeClass } = overallConfig(score);

  return (
    <div className="space-y-5 max-w-3xl">
      {/* ── Header card ── */}
      <div className="bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] mb-1">
            {isCompleted ? "Interview Complete" : "Interview In Progress"}
          </p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {interview.role}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
            <Calendar size={11} />
            {date} · {interview.conversation?.length ?? 0} questions
          </div>

          {isCompleted ? (
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing
                  value={score}
                  max={100}
                  label="Overall"
                  color={color}
                />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
                >
                  {label}
                </span>
              </div>
              <div className="h-16 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />
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
          ) : (
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
              This interview was not completed
            </span>
          )}
        </div>
      </div>

      {/* ── Q&A Conversation ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-[#222]">
          <MessageSquare size={15} className="text-[#ea580c]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Q&amp;A Transcript
          </h3>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            {interview.conversation?.length ?? 0}
          </span>
        </div>
        <div className="p-4 space-y-3">
          {interview.conversation?.length ? (
            interview.conversation.map((turn, i) => (
              <TurnCard
                key={i}
                turn={turn}
                index={i}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-2">
              No questions recorded.
            </p>
          )}
        </div>
      </div>

      {/* ── Feedback sections (only for completed interviews) ── */}
      {isCompleted && feedback && (
        <>
          <FeedbackSection
            title="Strengths"
            icon={CheckCircle2}
            iconColor="text-green-500"
            items={strengths}
            emptyText="No specific strengths recorded."
          />
          <FeedbackSection
            title="Areas of Weakness"
            icon={AlertTriangle}
            iconColor="text-amber-500"
            items={weaknesses}
            emptyText="No significant weaknesses identified."
          />
          <FeedbackSection
            title="How to Improve"
            icon={TrendingUp}
            iconColor="text-[#ea580c]"
            items={improvements}
            emptyText="No specific improvement suggestions."
          />
        </>
      )}
    </div>
  );
}
