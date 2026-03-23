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
 *   score        — overall score (0-100, computed server-side)
 *   onRetry()    — called when the user wants to start a new interview
 *   onAnalyze()  — called when the user wants to analyze the interview (optional)
 */

import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Star,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
        width="90"
        height="90"
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

export default function InterviewFeedback({
  interviewId,
  feedback,
  score,
  onRetry,
  onAnalyze,
}) {
  const { submitInterviewFeedback, getLiveInterviewById } = useInterview();
  const { label, color, badgeClass } = overallConfig(score ?? 0);

  const techScore = feedback?.technicalScore ?? 0;
  const commScore = feedback?.communicationScore ?? 0;
  const strengths = feedback?.strengths || [];
  const weaknesses = feedback?.weaknesses || [];
  const improvements = feedback?.improvements || [];

  const existingUserFeedback = feedback?.userFeedback || null;
  const [rating, setRating] = useState(existingUserFeedback?.rating || 0);
  const [comment, setComment] = useState(existingUserFeedback?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(existingUserFeedback));

  useEffect(() => {
    let isMounted = true;

    if (!interviewId) return () => {};

    getLiveInterviewById(interviewId)
      .then((iv) => {
        if (!isMounted) return;
        const saved = iv?.userFeedback;
        if (!saved) return;

        setRating(saved.rating || 0);
        setComment(saved.comment || "");
        setIsSubmitted(true);
      })
      .catch(() => {
        // Ignore read errors here; user can still submit feedback manually.
      });

    return () => {
      isMounted = false;
    };
  }, [interviewId, getLiveInterviewById]);

  const handleSubmitUserFeedback = async () => {
    if (!interviewId) {
      toast.error("Interview ID is missing.");
      return;
    }
    if (!rating) {
      toast.error("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInterviewFeedback({
        interviewId,
        rating,
        comment: comment.trim(),
      });
      setIsSubmitted(true);
      toast.success("Thanks! Your feedback has been saved.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* ── User feedback form ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#222]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Rate This Interview Experience
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Give a star rating and optional comment to help improve future
            sessions.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {isSubmitted && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Your feedback is saved and will always appear with this report.
            </p>
          )}

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => !isSubmitted && setRating(star)}
                  disabled={isSubmitted}
                  className="p-1 rounded-md disabled:cursor-default"
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={22}
                    className={
                      active
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                </button>
              );
            })}
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {rating ? `${rating}/5` : "No rating selected"}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitted || isSubmitting}
            maxLength={1000}
            rows={4}
            placeholder="Optional: Share what was useful or what could be better..."
            className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none disabled:opacity-70"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {comment.length}/1000 characters
            </p>
            <button
              type="button"
              onClick={handleSubmitUserFeedback}
              disabled={isSubmitted || isSubmitting || !rating}
              className="h-10 px-4 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : isSubmitted ? (
                "Feedback Saved"
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onAnalyze && (
          <button
            type="button"
            onClick={onAnalyze}
            className="h-12 flex-1 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Analyze Interview
          </button>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="h-12 flex-1 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-[#1e1e1e] flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Start Another Interview
        </button>
      </div>
    </div>
  );
}
