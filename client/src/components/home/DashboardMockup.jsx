import {
  Home,
  Mic,
  BarChart2,
  BookOpen,
  Sun,
  Users,
  Star,
  Zap,
  ArrowRight,
  Brain,
  TrendingUp,
  Lightbulb,
  Check,
  Search,
  Bell,
} from "lucide-react";

const defaultClass =
  "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
const defaultStyle = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
};

const DashboardMockup = ({ className, style } = {}) => (
  <div className={className ?? defaultClass} style={style ?? defaultStyle}>
    <div className="rounded-[18px] border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0d0d0d] flex h-[300px] sm:h-[500px] lg:h-[820px] overflow-hidden">
      {/* ── Slim icon sidebar ── */}
      <aside className="w-[44px] sm:w-[64px] bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex flex-col items-center py-3 sm:py-5 gap-1 flex-shrink-0">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Sumora"
          className="w-6 h-6 sm:w-9 sm:h-9 object-contain mb-3 sm:mb-6"
        />

        {/* Nav icons */}
        {[
          { Icon: Home, label: "Home", active: true },
          { Icon: Mic, label: "Interview", active: false },
          { Icon: BarChart2, label: "Analyze", active: false },
          { Icon: BookOpen, label: "Prepare", active: false },
        ].map(({ Icon, label, active }) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-0.5 p-1.5 sm:p-2 rounded-xl w-full mx-1 ${
              active ? "text-[#ea580c] bg-[#ea580c]/10" : "text-gray-400"
            }`}
          >
            <Icon size={14} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block" />
            <span className="text-[6px] sm:text-[8px] font-medium hidden sm:block">
              {label}
            </span>
          </div>
        ))}

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-2 sm:gap-3">
          <Sun size={13} className="text-gray-400 sm:hidden" />
          <Sun size={17} className="text-gray-400 hidden sm:block" />
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-[7px] sm:text-[9px] font-bold text-gray-300">
            SK
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0d0d0d]">
        {/* ── Top navbar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-200 dark:border-[#1e1e1e] bg-white dark:bg-[#121212]">
          {/* Search */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-400 w-28 sm:w-48">
            <Search size={9} className="sm:hidden flex-shrink-0" />
            <Search size={12} className="hidden sm:block flex-shrink-0" />
            <span className="text-[7px] sm:text-[10px] truncate">
              Search anything…
            </span>
          </div>
          {/* Right icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="relative">
              <Bell size={11} className="text-gray-400 sm:hidden" />
              <Bell size={15} className="text-gray-400 hidden sm:block" />
              <span className="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ea580c]" />
            </div>
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#ea580c] to-[#c2410c] flex items-center justify-center text-[6px] sm:text-[9px] font-bold text-white">
              SK
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-5 space-y-3 sm:space-y-5">
            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] p-4 sm:p-7 text-white">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/10 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-orange-200 text-[8px] sm:text-[10px] font-medium uppercase tracking-widest mb-1">
                    Good morning, Sumit 👋
                  </p>
                  <h1 className="text-sm sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
                    Welcome to Sumora AI
                  </h1>
                  <p className="text-orange-100 text-[9px] sm:text-xs max-w-[200px] sm:max-w-xs leading-relaxed hidden sm:block">
                    Your AI-powered career co-pilot. Practice interviews,
                    analyze your profile, and prepare smarter.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white text-[#ea580c] font-semibold text-[9px] sm:text-xs shadow-lg whitespace-nowrap">
                  <Zap size={10} className="sm:hidden" />
                  <Zap size={13} className="hidden sm:block" />
                  <span className="hidden sm:inline">Start Interview</span>
                  <span className="sm:hidden">Start</span>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                {
                  Icon: Users,
                  value: "12K+",
                  label: "Users",
                  color: "#ea580c",
                },
                {
                  Icon: Mic,
                  value: "48K+",
                  label: "Interviews",
                  color: "#7c3aed",
                },
                {
                  Icon: BarChart2,
                  value: "31K+",
                  label: "Reports",
                  color: "#0ea5e9",
                },
                {
                  Icon: Star,
                  value: "4.9★",
                  label: "Rating",
                  color: "#f59e0b",
                },
              ].map(({ Icon, value, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222]"
                >
                  <div
                    className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={11} className="sm:hidden" style={{ color }} />
                    <Icon
                      size={15}
                      className="hidden sm:block"
                      style={{ color }}
                    />
                  </div>
                  <div>
                    <p className="text-xs sm:text-base font-bold text-gray-900 dark:text-white leading-none">
                      {value}
                    </p>
                    <p className="text-[7px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  Icon: Mic,
                  title: "Mock Interview",
                  tag: "Popular",
                  color: "#ea580c",
                  desc: "Live role-aware interview with real-time feedback.",
                },
                {
                  Icon: BarChart2,
                  title: "Resume Analyzer",
                  tag: null,
                  color: "#0ea5e9",
                  desc: "Match score, skill gaps & ATS tips.",
                },
                {
                  Icon: BookOpen,
                  title: "Topic Prep",
                  tag: null,
                  color: "#7c3aed",
                  desc: "Interactive AI quizzes on any subject.",
                },
              ].map(({ Icon, title, tag, color, desc }) => (
                <div
                  key={title}
                  className="relative flex flex-col gap-1.5 sm:gap-3 p-2 sm:p-4 rounded-xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222]"
                >
                  <div
                    className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={11} className="sm:hidden" style={{ color }} />
                    <Icon
                      size={15}
                      className="hidden sm:block"
                      style={{ color }}
                    />
                  </div>
                  {tag && (
                    <span className="absolute top-2 right-2 text-[6px] sm:text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#ea580c]/10 text-[#ea580c]">
                      {tag}
                    </span>
                  )}
                  <p className="text-[8px] sm:text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                    {title}
                  </p>
                  <p className="text-[7px] sm:text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed hidden sm:block">
                    {desc}
                  </p>
                  <span className="hidden sm:flex items-center gap-1 text-[9px] font-medium text-[#ea580c]">
                    Get started <ArrowRight size={9} />
                  </span>
                </div>
              ))}
            </div>

            {/* Tech stack row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                {
                  Icon: Brain,
                  label: "LLaMA 3.1",
                  sub: "Interview AI",
                  color: "#ea580c",
                },
                {
                  Icon: Lightbulb,
                  label: "Gemini 2.5",
                  sub: "Analysis",
                  color: "#0ea5e9",
                },
                {
                  Icon: Zap,
                  label: "LangChain",
                  sub: "Memory",
                  color: "#7c3aed",
                },
                {
                  Icon: TrendingUp,
                  label: "Groq",
                  sub: "Low latency",
                  color: "#10b981",
                },
              ].map(({ Icon, label, sub, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222] gap-1 sm:gap-2"
                >
                  <div
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={10} className="sm:hidden" style={{ color }} />
                    <Icon
                      size={14}
                      className="hidden sm:block"
                      style={{ color }}
                    />
                  </div>
                  <p className="text-[7px] sm:text-[10px] font-semibold text-gray-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-[6px] sm:text-[9px] text-gray-500 dark:text-gray-400 hidden sm:block">
                    {sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Why Sumora checklist teaser */}
            <div className="p-3 sm:p-5 rounded-xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222] space-y-1.5 sm:space-y-2.5">
              <p className="text-[8px] sm:text-xs font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Why Sumora AI?
              </p>
              {[
                "Industry-specific questions for your role",
                "LLaMA 3.1 backbone — natural dialogue",
                "Scores & feedback after every session",
              ].map((item) => (
                <div key={item} className="flex items-start gap-1.5 sm:gap-2">
                  <Check
                    size={9}
                    className="text-[#ea580c] flex-shrink-0 mt-0.5 sm:hidden"
                  />
                  <Check
                    size={12}
                    className="text-[#ea580c] flex-shrink-0 mt-0.5 hidden sm:block"
                  />
                  <span className="text-[7px] sm:text-[10px] text-gray-600 dark:text-gray-400">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMockup;
