/**
 * InterviewHistoryDetail.jsx
 *
 * Shows the full detail of a completed (or in-progress) live interview:
 *   - Header with scores
 *   - Full Q&A conversation accordion
 *   - Feedback sections (strengths, weaknesses, improvements)
 *   - "Analyze Interview" button → AI walkthrough teaching mode
 *
 * Props:
 *   interview — full LiveInterview document (with parsed feedback object)
 */

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Calendar,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Zap,
  Loader2,
} from "lucide-react";
import { useInterview } from "../../../context/InterviewContext";

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

// ── Walkthrough view ──────────────────────────────────────────────────────────

function WalkthroughView({ interview, onClose }) {
  const { analyzeQuestion } = useInterview();
  const conversation = interview.conversation || [];
  const total = conversation.length;

  const [walkIdx, setWalkIdx] = useState(0);
  const [teaching, setTeaching] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const cacheRef = useRef({});

  const turn = conversation[walkIdx];

  // Fetch teaching for the current question (cached per index)
  useEffect(() => {
    if (!turn) return;
    setAnswerOpen(false);

    if (cacheRef.current[walkIdx]) {
      setTeaching(cacheRef.current[walkIdx]);
      return;
    }

    setTeaching(null);
    setLoading(true);
    analyzeQuestion(interview._id, walkIdx)
      .then((t) => {
        cacheRef.current[walkIdx] = t;
        setTeaching(t);
      })
      .catch(() => setTeaching(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkIdx]);

  return (
    <div className="max-w-3xl space-y-4">
      {/* ── Walkthrough header ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#ea580c]/15 flex items-center justify-center">
            <Sparkles size={14} className="text-[#ea580c]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c]">
              AI Walkthrough
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Question {walkIdx + 1} of {total}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors"
        >
          <X size={13} /> Exit
        </button>
      </div>

      {/* ── Progress dots ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {conversation.map((_, i) => (
          <button
            key={i}
            onClick={() => setWalkIdx(i)}
            title={`Question ${i + 1}`}
            className={[
              "h-2 rounded-full transition-all",
              i === walkIdx
                ? "w-6 bg-[#ea580c]"
                : cacheRef.current[i]
                  ? "w-2 bg-[#ea580c]/40"
                  : "w-2 bg-gray-200 dark:bg-[#333]",
            ].join(" ")}
          />
        ))}
      </div>

      {/* ── Question card ── */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c] block mb-3">
            Question {walkIdx + 1}
          </span>
          <p className="text-white text-[15px] font-medium leading-relaxed">
            {turn?.question}
          </p>
        </div>
      </div>

      {/* ── Your answer (collapsible) ── */}
      {turn?.answer?.trim() && (
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => setAnswerOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Your Answer
            </span>
            {answerOpen ? (
              <ChevronUp size={14} className="text-gray-400" />
            ) : (
              <ChevronDown size={14} className="text-gray-400" />
            )}
          </button>
          {answerOpen && (
            <div className="px-5 pb-4 border-t border-gray-100 dark:border-[#222]">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-3 whitespace-pre-line">
                {turn.answer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── AI teaching card ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-[#222] bg-gradient-to-r from-[#ea580c]/5 to-transparent">
          <Sparkles size={14} className="text-[#ea580c]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            How to Answer This
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <Loader2 size={22} className="animate-spin text-[#ea580c]" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Preparing your teaching…
            </p>
          </div>
        ) : teaching ? (
          <div className="p-6 space-y-6">
            {/* Why section */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mt-0.5">
                <Lightbulb size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 mb-1.5">
                  Why They Ask This
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {teaching.why}
                </p>
              </div>
            </div>

            {/* Key points */}
            {teaching.structure?.length > 0 && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mt-0.5">
                  <ListChecks size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 mb-2">
                    Key Points to Cover
                  </p>
                  <ul className="space-y-1.5">
                    {teaching.structure.map((pt, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Sample answer */}
            {teaching.sampleAnswer && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center mt-0.5">
                  <MessageCircle size={14} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-green-500 mb-2">
                    Sample Strong Answer
                  </p>
                  <div className="bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/15 rounded-xl p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      "{teaching.sampleAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pro tip */}
            {teaching.tip && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mt-0.5">
                  <Zap size={14} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-500 mb-1.5">
                    Pro Tip
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {teaching.tip}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Could not load teaching. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setWalkIdx((i) => i - 1)}
          disabled={walkIdx === 0}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gray-100 dark:bg-[#222] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} /> Prev
        </button>

        <div className="flex-1 text-center text-xs text-gray-400 dark:text-gray-500">
          {walkIdx + 1} / {total}
        </div>

        <button
          onClick={() => setWalkIdx((i) => i + 1)}
          disabled={walkIdx === total - 1}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InterviewHistoryDetail({ interview }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [isWalkthrough, setIsWalkthrough] = useState(false);

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
  const hasConversation = (interview.conversation?.length ?? 0) > 0;

  const { label, color, badgeClass } = overallConfig(score);

  if (isWalkthrough) {
    return (
      <WalkthroughView
        interview={interview}
        onClose={() => setIsWalkthrough(false)}
      />
    );
  }

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
            {interview.role || interview.topic || "Interview"}
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

          {/* Analyze button */}
          {hasConversation && (
            <button
              onClick={() => setIsWalkthrough(true)}
              className="mt-6 flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all shadow-sm shadow-orange-500/20"
            >
              <Sparkles size={14} />
              Analyze Interview
            </button>
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
