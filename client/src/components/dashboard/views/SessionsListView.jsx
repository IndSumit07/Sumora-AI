import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Layers, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { useInterview } from "../../../context/InterviewContext";

const scoreStyle = (s) => {
  if (s >= 75) return "bg-green-50 text-green-700";
  if (s >= 50) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-600";
};

const SessionCard = ({ session }) => {
  const date = new Date(session.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const excerpt =
    session.jobDescription.length > 110
      ? session.jobDescription.slice(0, 110) + "…"
      : session.jobDescription;

  return (
    <Link
      to={`/dashboard/sessions/${session._id}`}
      className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-[#ea580c]/40 hover:shadow-md transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#ea580c] transition-colors line-clamp-2 flex-1">
          {session.title}
        </h3>
        {session.report ? (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${scoreStyle(
              session.report.matchScore,
            )}`}
          >
            {session.report.matchScore}%
          </span>
        ) : (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 flex-shrink-0 whitespace-nowrap">
            No report yet
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
        {excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={11} />
          {date}
        </div>
        <span className="flex items-center gap-0.5 text-xs font-medium text-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity">
          View <ChevronRight size={12} />
        </span>
      </div>
    </Link>
  );
};

const SessionsListView = () => {
  const { sessions, sessionsLoading, getAllSessions } = useInterview();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    getAllSessions().finally(() => setInitialized(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialized || sessionsLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-[#ea580c]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            My Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/dashboard/new"
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
        >
          <Plus size={14} />
          New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Layers size={22} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No sessions yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-[260px]">
            Create your first session and let AI prepare you for any interview.
          </p>
          <Link
            to="/dashboard/new"
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Plus size={14} />
            Create Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <SessionCard key={s._id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsListView;
