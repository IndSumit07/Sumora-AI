import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart2,
  BookOpen,
  Clock3,
  ClipboardList,
  Gauge,
  Loader2,
  Mic,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useInterview } from "../../../context/InterviewContext";

const REFRESH_SECONDS = 120;

const avg = (values) => {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, n) => sum + n, 0) / values.length);
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const percent = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

const max = (values) => {
  if (!values.length) return 0;
  return Math.max(...values);
};

const formatCountdown = (secondsLeft) => {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const scoreTone = (score) => {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const ProgressRow = ({ label, value }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-semibold ${scoreTone(value)}`}>{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-[#252525] overflow-hidden">
      <div
        className="h-full rounded-full bg-[#ea580c]"
        style={{ width: `${Math.max(4, value)}%` }}
      />
    </div>
  </div>
);

const StatsCard = ({ title, value, subtitle, icon }) => {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div className="h-8 w-8 rounded-lg bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center">
          <IconComponent size={15} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
};

const FeatureSummaryCard = ({ title, avgValue, maxValue, total, icon }) => {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-[#2a2a2a] bg-gradient-to-br from-white to-orange-50/40 dark:from-[#171717] dark:to-[#111111] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        <div className="h-8 w-8 rounded-lg bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center">
          <IconComponent size={15} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/80 dark:bg-[#1f1f1f] py-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Avg</p>
          <p className={`text-sm font-bold ${scoreTone(avgValue)}`}>{avgValue}%</p>
        </div>
        <div className="rounded-lg bg-white/80 dark:bg-[#1f1f1f] py-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Max</p>
          <p className={`text-sm font-bold ${scoreTone(maxValue)}`}>{maxValue}%</p>
        </div>
        <div className="rounded-lg bg-white/80 dark:bg-[#1f1f1f] py-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{total}</p>
        </div>
      </div>
    </div>
  );
};

const StatsView = () => {
  const { getAllLiveInterviews, getAllReports } = useInterview();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [liveInterviews, setLiveInterviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [secondsToRefresh, setSecondsToRefresh] = useState(REFRESH_SECONDS);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isRefreshLocked = secondsToRefresh > 0;

  const fetchStats = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      try {
        const [live, reportList] = await Promise.all([
          getAllLiveInterviews(),
          getAllReports(),
        ]);
        setLiveInterviews(Array.isArray(live) ? live : []);
        setReports(Array.isArray(reportList) ? reportList : []);
        setSecondsToRefresh(REFRESH_SECONDS);
        setLastUpdated(new Date());
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load stats.");
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [getAllLiveInterviews, getAllReports],
  );

  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsToRefresh((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const model = useMemo(() => {
    const completedLive = liveInterviews.filter(
      (item) => item.status === "completed",
    );
    const completedJob = completedLive.filter((item) => item.mode === "job");
    const completedPrepare = completedLive.filter(
      (item) => item.mode === "prepare",
    );

    const interviewScores = completedJob.map((item) => item.score || 0);
    const prepareScores = completedPrepare.map((item) => item.score || 0);
    const reportScores = reports.map((item) => item.matchScore || 0);

    const allScoreSignals = [
      ...interviewScores,
      ...prepareScores,
      ...reportScores,
    ];

    const now = Date.now();
    const days7 = 7 * 24 * 60 * 60 * 1000;
    const days30 = 30 * 24 * 60 * 60 * 1000;

    const activityItems = [
      ...liveInterviews.map((item) => ({
        id: `live-${item._id}`,
        type: item.mode === "prepare" ? "Prepare" : "Interview",
        title:
          item.mode === "prepare"
            ? item.topic || item.subject || "Prepare session"
            : item.role || "Interview session",
        status: item.status === "completed" ? "Completed" : "In Progress",
        score: item.status === "completed" ? item.score || 0 : null,
        createdAt: item.createdAt,
      })),
      ...reports.map((item) => ({
        id: `report-${item._id}`,
        type: "Analysis",
        title: item.title || item.role || "Resume analysis",
        status: "Generated",
        score: item.matchScore || 0,
        createdAt: item.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const topPrepareSubjects = completedPrepare.reduce((acc, item) => {
      const key = item.subject || "General";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topSubject = Object.entries(topPrepareSubjects).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const weekActivity = activityItems.filter(
      (item) => now - new Date(item.createdAt).getTime() <= days7,
    ).length;

    const monthActivity = activityItems.filter(
      (item) => now - new Date(item.createdAt).getTime() <= days30,
    ).length;

    return {
      totals: {
        interviewDone: completedJob.length,
        prepareDone: completedPrepare.length,
        analysisDone: reports.length,
        logs: activityItems.length,
        interviewAll: liveInterviews.filter((item) => item.mode === "job").length,
        prepareAll: liveInterviews.filter((item) => item.mode === "prepare").length,
      },
      averages: {
        interview: avg(interviewScores),
        prepare: avg(prepareScores),
        analysis: avg(reportScores),
        overall: avg(allScoreSignals),
      },
      maxScores: {
        interview: max(interviewScores),
        prepare: max(prepareScores),
        analysis: max(reportScores),
        overall: max(allScoreSignals),
      },
      completionRate: percent(completedLive.length, liveInterviews.length),
      weekActivity,
      monthActivity,
      topSubject: topSubject
        ? `${topSubject[0]} (${topSubject[1]})`
        : "No prepare sessions yet",
      recentLogs: activityItems.slice(0, 20),
    };
  }, [liveInterviews, reports]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          Loading your stats
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full px-6 py-10">
        <div className="max-w-3xl mx-auto rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-5">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#ea580c]/25 bg-gradient-to-br from-[#fff7ed] via-[#fffaf5] to-white dark:from-[#20130c] dark:via-[#151311] dark:to-[#0f0f0f] p-7 sm:p-8 shadow-[0_20px_50px_rgba(234,88,12,0.08)] dark:shadow-none">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ea580c]/12 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-orange-200/30 dark:bg-orange-900/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#ea580c] mb-2 inline-flex items-center gap-1.5">
                <Sparkles size={12} />
                Performance Snapshot
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Stats & Activity Center
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                Professional analytics for your interview practice, preparation
                sessions, and resume analysis progress.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {isRefreshLocked
                  ? `Refresh unlocks in ${formatCountdown(secondsToRefresh)}`
                  : "Refresh unlocked. You can fetch fresh stats now."}
                {lastUpdated
                  ? ` • Last updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : ""}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <button
                onClick={() => fetchStats(true)}
                disabled={refreshing || loading || isRefreshLocked}
                className="h-10 px-4 rounded-xl bg-[#ea580c] text-white text-sm font-semibold hover:bg-[#d24e0b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing
                  ? "Refreshing..."
                  : isRefreshLocked
                    ? `Locked ${formatCountdown(secondsToRefresh)}`
                    : "Refresh"}
              </button>

              <div className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white/80 dark:bg-[#161616]/80 px-4 py-3 min-w-[150px]">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 inline-flex items-center gap-1.5">
                  <Gauge size={12} /> Overall average
                </p>
                <p className={`text-2xl font-bold ${scoreTone(model.averages.overall)}`}>
                  {model.averages.overall}%
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Interviews Completed"
            value={model.totals.interviewDone}
            subtitle="Job-based live interviews"
            icon={Mic}
          />
          <StatsCard
            title="Prepare Sessions"
            value={model.totals.prepareDone}
            subtitle="Topic-focused practice done"
            icon={BookOpen}
          />
          <StatsCard
            title="Analyses Generated"
            value={model.totals.analysisDone}
            subtitle="Resume and JD analysis reports"
            icon={BarChart2}
          />
          <StatsCard
            title="Activity Logs"
            value={model.totals.logs}
            subtitle="Combined timeline entries"
            icon={ClipboardList}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Score Averages
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Across completed work
              </span>
            </div>
            <div className="space-y-4">
              <ProgressRow
                label="Interview average"
                value={model.averages.interview}
              />
              <ProgressRow
                label="Prepare average"
                value={model.averages.prepare}
              />
              <ProgressRow
                label="Analysis match average"
                value={model.averages.analysis}
              />
              <ProgressRow
                label="Overall average"
                value={model.averages.overall}
              />
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#222]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 inline-flex items-center gap-1.5">
                <Clock3 size={12} /> Max and Average by Feature
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureSummaryCard
                  title="Interview"
                  avgValue={model.averages.interview}
                  maxValue={model.maxScores.interview}
                  total={model.totals.interviewAll}
                  icon={Mic}
                />
                <FeatureSummaryCard
                  title="Prepare"
                  avgValue={model.averages.prepare}
                  maxValue={model.maxScores.prepare}
                  total={model.totals.prepareAll}
                  icon={BookOpen}
                />
                <FeatureSummaryCard
                  title="Analysis"
                  avgValue={model.averages.analysis}
                  maxValue={model.maxScores.analysis}
                  total={model.totals.analysisDone}
                  icon={BarChart2}
                />
                <FeatureSummaryCard
                  title="Overall"
                  avgValue={model.averages.overall}
                  maxValue={model.maxScores.overall}
                  total={model.totals.logs}
                  icon={TrendingUp}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-[#ea580c]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Highlights
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-gray-50 dark:bg-[#1e1e1e] px-3.5 py-3">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Completion rate
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {model.completionRate}%
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-[#1e1e1e] px-3.5 py-3">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Activity in last 7 days
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {model.weekActivity}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-[#1e1e1e] px-3.5 py-3">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Activity in last 30 days
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {model.monthActivity}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-[#1e1e1e] px-3.5 py-3">
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Top prepare subject
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {model.topSubject}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#222]">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-[#ea580c]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Logs
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Latest 20 entries
            </span>
          </div>

          {model.recentLogs.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              No activity yet. Start an interview, prepare session, or analysis
              to populate stats.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#1b1b1b] text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-5 sm:px-6 py-3 text-left font-semibold">
                      Type
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left font-semibold">
                      Title
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left font-semibold">
                      Score
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {model.recentLogs.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-100 dark:border-[#222] text-gray-700 dark:text-gray-300"
                    >
                      <td className="px-5 sm:px-6 py-3.5">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#ea580c]/10 text-[#ea580c]">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-3.5">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {row.title}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-gray-500 dark:text-gray-400">
                        {row.status}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5">
                        {typeof row.score === "number" ? (
                          <span
                            className={`font-semibold ${scoreTone(row.score)}`}
                          >
                            {row.score}%
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-gray-500 dark:text-gray-400">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StatsView;
