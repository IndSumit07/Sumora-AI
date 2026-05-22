import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Mic,
  BarChart2,
  BookOpen,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  Star,
  Play,
  ChevronRight,
  Award,
  Activity,
  Brain,
  FileText,
  Target,
} from "lucide-react";

/* ── Helpers ─────────────────────────────────────────── */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* ── Filter Tabs ─────────────────────────────────────── */
const FILTERS = ["All Services", "Interview", "Prepare", "Analyze"];

/* ── Service Data ────────────────────────────────────── */
const SERVICES = [
  {
    id: "interview",
    to: "/dashboard/interview",
    tag: "🔥 Popular",
    tagBg: "#ea580c",
    title: "AI Mock Interview",
    subtitle: "Real-time voice interview simulation",
    icon: Mic,
    bgClass: "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-[#281608] dark:via-[#1d0e03] dark:to-[#140800] border-transparent dark:border-orange-900/30",
    iconBg: "#ea580c",
    accentColor: "#ea580c",
    tokenCost: 20,
    usedCount: 3,
    totalCount: 10,
    category: "Interview",
    rating: 4.9,
    participants: 1240,
    description:
      "Live voice interview with company-specific style and full performance report.",
  },
  {
    id: "prepare",
    to: "/dashboard/prepare",
    tag: "⭐ Recommended",
    tagBg: "#7c3aed",
    title: "Interview Prep",
    subtitle: "Targeted Q&A practice sessions",
    icon: BookOpen,
    bgClass: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-[#21123a] dark:via-[#160a2b] dark:to-[#0f061f] border-transparent dark:border-purple-900/30",
    iconBg: "#7c3aed",
    accentColor: "#7c3aed",
    tokenCost: 20,
    usedCount: 5,
    totalCount: 12,
    category: "Prepare",
    rating: 4.7,
    participants: 890,
    description:
      "Targeted Q&A practice and role-specific preparation workflows.",
  },
  {
    id: "analyze",
    to: "/dashboard/analyze",
    tag: "🤖 AI-Powered",
    tagBg: "#0ea5e9",
    title: "Resume Analysis",
    subtitle: "ATS scoring & feedback",
    icon: BarChart2,
    bgClass: "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 dark:from-[#0b1f2e] dark:via-[#071520] dark:to-[#040d15] border-transparent dark:border-sky-900/30",
    iconBg: "#0ea5e9",
    accentColor: "#0ea5e9",
    tokenCost: 25,
    usedCount: 2,
    totalCount: 8,
    category: "Analyze",
    rating: 4.8,
    participants: 680,
    description:
      "ATS scoring and section-based resume feedback against job requirements.",
  },
];

/* ── Recent Sessions Data ─────────────────────────────── */
const RECENT_SESSIONS = [
  {
    id: 1,
    title: "Software Engineer Interview",
    subtitle: "AI Mock Interview — Full-stack",
    type: "Interview",
    icon: Mic,
    iconColor: "#ea580c",
    score: 82,
    duration: "28 min",
    date: formatDate(1),
    status: "completed",
  },
  {
    id: 2,
    title: "System Design Q&A",
    subtitle: "Interview Prep — Architecture",
    type: "Prepare",
    icon: BookOpen,
    iconColor: "#7c3aed",
    score: 76,
    duration: "40 min",
    date: formatDate(2),
    status: "completed",
  },
  {
    id: 3,
    title: "Resume for SDE Role",
    subtitle: "Resume Analysis — ATS Check",
    type: "Analyze",
    icon: BarChart2,
    iconColor: "#0ea5e9",
    score: 91,
    duration: "12 min",
    date: formatDate(3),
    status: "completed",
  },
  {
    id: 4,
    title: "Behavioral Interview Round",
    subtitle: "AI Mock Interview — FAANG style",
    type: "Interview",
    icon: Mic,
    iconColor: "#ea580c",
    score: 68,
    duration: "35 min",
    date: formatDate(5),
    status: "completed",
  },
  {
    id: 5,
    title: "DSA Practice Session",
    subtitle: "Interview Prep — Algorithms",
    type: "Prepare",
    icon: BookOpen,
    iconColor: "#7c3aed",
    score: 74,
    duration: "55 min",
    date: formatDate(6),
    status: "completed",
  },
];

/* ── Avatar group ─────────────────────────────────────── */
const AvatarGroup = ({ count, colors }) => (
  <div className="flex items-center">
    {colors.map((c, i) => (
      <div
        key={i}
        className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
        style={{
          background: c,
          marginLeft: i === 0 ? 0 : -8,
          zIndex: colors.length - i,
        }}
      >
        {String.fromCharCode(65 + i)}
      </div>
    ))}
    {count > colors.length && (
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5 font-medium">
        +{count - colors.length}
      </span>
    )}
  </div>
);

/* ── Score Badge ────────────────────────────────────── */
const ScoreBadge = ({ score }) => {
  const color =
    score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ color, background: `${color}18` }}
    >
      <Star size={10} className="fill-current" />
      {score}
    </span>
  );
};

/* ── Service Card ─────────────────────────────────── */
const ServiceCard = ({ service }) => {
  const Icon = service.icon;
  const progress = Math.round((service.usedCount / service.totalCount) * 100);

  return (
    <Link
      to={service.to}
      className={`group relative flex flex-col gap-4 p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border ${service.bgClass}`}
      style={{
        boxShadow: `0 4px 20px ${service.accentColor}18`,
      }}
    >
      {/* Decorative circle blob */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 dark:opacity-10 transition-all duration-500 group-hover:opacity-30 dark:group-hover:opacity-20 group-hover:scale-110"
        style={{ background: service.accentColor }}
      />

      {/* Top row: icon + tag */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{
            background: service.accentColor,
            boxShadow: `0 6px 20px ${service.accentColor}50`,
          }}
        >
          <Icon size={22} className="text-white" />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
          style={{ background: `${service.accentColor}cc` }}
        >
          {service.tag}
        </span>
      </div>

      {/* Title */}
      <div className="relative z-10">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-1">
          {service.title}
        </h3>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Progress */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-gray-600 dark:text-gray-400 font-semibold">Progress</span>
          <span className="text-[11px] font-bold" style={{ color: service.accentColor }}>
            {service.usedCount}/{service.totalCount} sessions
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: `${service.accentColor}25` }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${service.accentColor}aa, ${service.accentColor})`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between mt-auto">
        <AvatarGroup
          count={service.participants}
          colors={["#ea580c", "#7c3aed", "#0ea5e9", "#10b981"]}
        />
        <button
          className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: service.accentColor }}
        >
          <Play size={10} className="fill-white" />
          Start
        </button>
      </div>
    </Link>
  );
};

/* ── Stats Mini Card ─────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222]">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: color + "22" }}
    >
      <Icon size={17} style={{ color }} />
    </div>
    <div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
        {label}
      </p>
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────── */
const DashboardHome = () => {
  const { user } = useAuth();
  const name = user?.username ? user.username.split(" ")[0] : "there";
  const tokens = user?.tokens || 0;
  const [activeFilter, setActiveFilter] = useState("All Services");

  const filteredServices =
    activeFilter === "All Services"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeFilter);

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f7] dark:bg-[#0d0d0d]">
      <div className="max-w-[1400px] mx-auto px-4 py-5 md:px-6 md:py-6">

        {/* ── Header Row ── */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {greeting()},{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {name}!
              </span>
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Services
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={[
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                  activeFilter === f
                    ? "bg-[#ea580c] text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30"
                    : "bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a2a2a] hover:border-[#ea580c]/40 hover:text-[#ea580c]",
                ].join(" ")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          {/* Left Column */}
          <div className="space-y-5">

            {/* Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                icon={Zap}
                label="Tokens Left"
                value={tokens}
                color="#ea580c"
              />
              <StatCard
                icon={Activity}
                label="Sessions Done"
                value="12"
                color="#7c3aed"
              />
              <StatCard
                icon={Target}
                label="Avg. Score"
                value="78%"
                color="#0ea5e9"
              />
              <StatCard
                icon={Award}
                label="Best Score"
                value="91%"
                color="#10b981"
              />
            </div>

            {/* ── Recent Sessions ── */}
            <div className="bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-[#222] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#222]">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                    My recent sessions
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Your latest activity across all tools
                  </p>
                </div>
                <Link
                  to="/dashboard/stats"
                  className="flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:opacity-80 transition-opacity"
                >
                  View all sessions <ChevronRight size={13} />
                </Link>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_80px_70px] px-5 py-2 bg-gray-50 dark:bg-[#111]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Session
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Type
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Duration
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-right">
                  Score
                </span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-gray-50 dark:divide-[#1d1d1d]">
                {RECENT_SESSIONS.map((session) => {
                  const Icon = session.icon;
                  return (
                    <div
                      key={session.id}
                      className="grid grid-cols-[1fr_120px_80px_70px] items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                    >
                      {/* Session info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: session.iconColor + "18" }}
                        >
                          <Icon
                            size={14}
                            style={{ color: session.iconColor }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {session.title}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {session.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Type */}
                      <div>
                        <span
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            color:
                              session.type === "Interview"
                                ? "#ea580c"
                                : session.type === "Prepare"
                                ? "#7c3aed"
                                : "#0ea5e9",
                            background:
                              session.type === "Interview"
                                ? "#ea580c18"
                                : session.type === "Prepare"
                                ? "#7c3aed18"
                                : "#0ea5e918",
                          }}
                        >
                          {session.type}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1">
                        <Clock
                          size={11}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          {session.duration}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex justify-end">
                        <ScoreBadge score={session.score} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="flex flex-col gap-4">

            {/* Token Balance Card */}
            <div className="bg-white dark:bg-[#161616] rounded-2xl p-5 relative overflow-hidden border border-gray-100 dark:border-[#222] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              {/* glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#ea580c]/10 dark:bg-[#ea580c]/15 blur-3xl pointer-events-none group-hover:bg-[#ea580c]/15 dark:group-hover:bg-[#ea580c]/20 transition-colors" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#7c3aed]/5 dark:bg-[#7c3aed]/10 blur-2xl pointer-events-none group-hover:bg-[#7c3aed]/10 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#ea580c]/10 dark:bg-[#ea580c]/15 flex items-center justify-center">
                    <Zap size={15} className="text-[#ea580c] fill-[#ea580c]" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Token Balance
                  </span>
                </div>

                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{tokens}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                  Available interview tokens
                </p>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-5">
                  {[
                    { label: "Mock Interview", cost: "20 tokens", color: "#ea580c" },
                    { label: "Interview Prep", cost: "20 tokens", color: "#7c3aed" },
                    { label: "Resume Analysis", cost: "25 tokens", color: "#0ea5e9" },
                  ].map(({ label, cost, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: color }}
                        />
                        <span>{label}</span>
                      </div>
                      <span className="font-semibold" style={{ color }}>
                        {cost}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/dashboard/billing"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ea580c] text-white text-sm font-semibold hover:bg-[#d24e0b] transition-colors"
                >
                  <Zap size={13} className="fill-white" />
                  Buy More Tokens
                </Link>
              </div>
            </div>

            {/* Recommended Next Step */}
            <div className="bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-[#222] p-5 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Recommended for you
              </p>

              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">
                  Interview Prep
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-2">
                Master Behavioral Questions with the STAR Method
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Structured practice for "tell me about yourself", conflict
                resolution, and leadership scenarios.
              </p>

              <div className="flex items-center gap-2 mb-5">
                <AvatarGroup
                  count={890}
                  colors={["#ea580c", "#7c3aed", "#0ea5e9"]}
                />
                <span className="text-[11px] text-gray-400">
                  already practicing
                </span>
              </div>

              <Link
                to="/dashboard/prepare"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ea580c] text-white text-sm font-semibold hover:bg-[#d24e0b] transition-all hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/30 active:scale-[0.98]"
              >
                Start Prep <ArrowRight size={14} />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-[#222] p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Quick actions
              </p>
              <div className="space-y-2">
                {[
                  {
                    to: "/dashboard/interview",
                    icon: Mic,
                    label: "New Mock Interview",
                    color: "#ea580c",
                  },
                  {
                    to: "/dashboard/analyze",
                    icon: FileText,
                    label: "Analyze My Resume",
                    color: "#0ea5e9",
                  },
                  {
                    to: "/dashboard/stats",
                    icon: Brain,
                    label: "View Performance",
                    color: "#10b981",
                  },
                ].map(({ to, icon: Icon, label, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: color + "18" }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex-1">
                      {label}
                    </span>
                    <ArrowRight
                      size={13}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-[#ea580c] transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
