/**
 * InterviewHistoryView.jsx
 *
 * Manages the "Live Interview" tab inside a session.
 *
 * Views:
 *   "list"   — shows all past interviews + "New Interview" button
 *   "new"    — shows InterviewPage (new interview flow)
 *   "detail" — shows InterviewHistoryDetail (full Q&A + scores)
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, Mic, Calendar, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import InterviewPage from "./InterviewPage";
import InterviewHistoryDetail from "./InterviewHistoryDetail";

// ── Score config helper ───────────────────────────────────────────────────────

const scoreConfig = (s) => {
  if (s >= 70)
    return { badgeClass: "bg-green-50 text-green-700", label: "Strong" };
  if (s >= 45)
    return { badgeClass: "bg-amber-50 text-amber-700", label: "Good" };
  return { badgeClass: "bg-red-50 text-red-600", label: "Needs Work" };
};

// ── Interview summary card ────────────────────────────────────────────────────

const InterviewCard = ({ interview, onClick }) => {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const isCompleted = interview.status === "completed";
  const { badgeClass, label } = scoreConfig(interview.score ?? 0);

  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-5 shadow-sm hover:border-[#ea580c]/40 hover:shadow-md transition-all flex items-center gap-4"
    >
      {/* Score / icon */}
      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
        {isCompleted ? (
          <span className="text-sm font-bold text-[#ea580c]">
            {interview.score}
          </span>
        ) : (
          <Mic size={18} className="text-[#ea580c]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {interview.role}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar size={11} />
            {date}
          </div>
          {isCompleted ? (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
            >
              {label}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
              Incomplete
            </span>
          )}
        </div>
      </div>

      <ChevronRight
        size={16}
        className="text-gray-300 dark:text-gray-600 group-hover:text-[#ea580c] transition-colors flex-shrink-0"
      />
    </button>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export default function InterviewHistoryView({ session }) {
  const { getLiveInterviewsBySession, getLiveInterviewById } = useInterview();

  const [view, setView] = useState("list"); // "list" | "new" | "detail"
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchInterviews = useCallback(async () => {
    try {
      const list = await getLiveInterviewsBySession(session._id);
      setInterviews(list);
    } catch {
      toast.error("Failed to load interview history.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session._id]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleSelectInterview = async (interview) => {
    setDetailLoading(true);
    try {
      const full = await getLiveInterviewById(interview._id);
      setSelected(full);
      setView("detail");
    } catch {
      toast.error("Failed to load interview details.");
    } finally {
      setDetailLoading(false);
    }
  };

  // ── New interview flow ────────────────────────────────────────────────────

  if (view === "new") {
    return (
      <InterviewPage
        session={session}
        onBack={() => setView("list")}
        onDone={() => {
          setLoading(true);
          fetchInterviews();
          setView("list");
        }}
      />
    );
  }

  // ── Detail view ───────────────────────────────────────────────────────────

  if (view === "detail" && selected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setView("list");
              setSelected(null);
            }}
            className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← All Interviews
          </button>
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#ea580c] text-xs font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Plus size={13} />
            New Interview
          </button>
        </div>
        <InterviewHistoryDetail interview={selected} />
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────

  if (loading || detailLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={26} className="animate-spin text-[#ea580c]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Interview History
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {interviews.length} session{interviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("new")}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
        >
          <Plus size={14} />
          New Interview
        </button>
      </div>

      {/* Empty state */}
      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mb-4">
            <Mic size={22} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            No interviews yet
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 max-w-[240px]">
            Start a live AI interview to practice for this role and get scored
            feedback.
          </p>
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Mic size={14} />
            Start Interview
          </button>
        </div>
      ) : (
        /* Interviews list */
        <div className="space-y-3">
          {interviews.map((iv) => (
            <InterviewCard
              key={iv._id}
              interview={iv}
              onClick={() => handleSelectInterview(iv)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
