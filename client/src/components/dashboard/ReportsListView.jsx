import { Link, useNavigate } from "react-router-dom";
import { useInterview } from "../../context/InterviewContext";
import { Plus, Layers } from "lucide-react";

const getInitials = (name) => (name || "??").slice(0, 2).toUpperCase();

const getScoreColor = (s) =>
  s >= 75 ? "text-green-500" : s >= 50 ? "text-amber-500" : "text-red-500";

const ReportsListView = () => {
  const { sessions, sessionsLoading } = useInterview();
  const navigate = useNavigate();

  if (sessionsLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-40 rounded-lg bg-gray-200 dark:bg-[#1e1e1e] animate-pulse mb-2" />
            <div className="h-4 w-24 rounded-md bg-gray-100 dark:bg-[#1a1a1a] animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-gray-200 dark:bg-[#1e1e1e] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-[#222] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Sessions
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {sessions?.length === 0
              ? "No sessions yet"
              : `${sessions.length} session${sessions.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          to="/dashboard/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-colors"
        >
          <Plus size={16} />
          New Session
        </Link>
      </div>

      {/* Empty state */}
      {sessions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
            <Layers size={28} className="text-[#ea580c]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No sessions yet
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mb-6">
            Create your first session to get started with AI-powered interview
            preparation.
          </p>
          <Link
            to="/dashboard/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Plus size={16} />
            Create Session
          </Link>
        </div>
      ) : (
        /* Sessions grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sessions.map((session) => {
            const score = session.latestReport?.matchScore ?? null;
            return (
              <button
                key={session._id}
                onClick={() => navigate(`/dashboard/sessions/${session._id}`)}
                className="group text-left flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-[#222] hover:border-[#ea580c]/50 hover:shadow-md transition-all"
              >
                {/* Initials + score */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#ea580c]/10 flex items-center justify-center text-sm font-bold text-[#ea580c]">
                    {getInitials(session.title)}
                  </div>
                  {score != null ? (
                    <span
                      className={`text-sm font-bold ${getScoreColor(score)}`}
                    >
                      {score}%
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#1e1e1e] px-2 py-0.5 rounded-full">
                      No report
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#ea580c] transition-colors">
                  {session.title}
                </h3>

                {/* Date */}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                  {new Date(session.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsListView;
