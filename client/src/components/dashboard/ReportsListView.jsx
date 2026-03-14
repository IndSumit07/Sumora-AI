import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ChevronRight, FileText } from "lucide-react";
import { useInterview } from "../../context/InterviewContext";
import toast from "react-hot-toast";

const scoreColor = (s) =>
  s >= 75 ? "#16a34a" : s >= 50 ? "#d97706" : "#dc2626";
const scoreLabel = (s) =>
  s >= 75 ? "Strong Match" : s >= 50 ? "Moderate Match" : "Weak Match";
const scoreBadge = (s) =>
  s >= 75
    ? "bg-green-100 text-green-700"
    : s >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
    <div className="h-3 bg-gray-100 rounded w-1/3 mb-5" />
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-gray-200" />
      <div className="h-3 bg-gray-100 rounded w-1/4" />
    </div>
  </div>
);

const ReportsListView = () => {
  const { getAllSessions } = useInterview();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSessions()
      .then(setSessions)
      .catch(() => toast.error("Failed to load sessions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            My Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {loading
              ? "Loading…"
              : `${sessions.length} session${sessions.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        <Link
          to="/dashboard/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
        >
          <Sparkles size={14} />
          New Interview
        </Link>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
            <FileText size={28} className="text-[#ea580c]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            No sessions yet
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Generate your first AI-powered interview prep report.
          </p>
          <Link
            to="/dashboard/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Sparkles size={14} />
            Create first session
          </Link>
        </div>
      )}

      {/* Sessions grid */}
      {!loading && sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-gray-300 transition-all"
            >
              {/* Title + score badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                  {s.title}
                </h3>
                {s.report ? (
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${scoreBadge(s.report.matchScore)}`}
                  >
                    {s.report.matchScore}
                  </span>
                ) : (
                  <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-400">
                    Pending
                  </span>
                )}
              </div>

              {/* Match label or pending text */}
              {s.report ? (
                <p
                  className="text-xs font-medium"
                  style={{ color: scoreColor(s.report.matchScore) }}
                >
                  {scoreLabel(s.report.matchScore)}
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Report not generated yet
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(s.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => navigate(`/dashboard/sessions/${s._id}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:text-[#d24e0b] transition-colors"
                >
                  View session <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsListView;
