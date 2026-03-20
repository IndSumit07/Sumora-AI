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
  CheckCircle,
  FileText,
  Monitor,
  Database,
  Globe,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  X,
  Upload,
} from "lucide-react";

const defaultClass =
  "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
const defaultStyle = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
};

const DashboardMockup = ({ className, style, activeTabId = 1 } = {}) => (
  <div className={className ?? defaultClass} style={style ?? defaultStyle}>
    <div className="rounded-[18px] border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0d0d0d] flex h-[300px] sm:h-[500px] lg:h-[820px] overflow-hidden transition-all duration-500">
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
          { Icon: Home, label: "Home", active: activeTabId === 1 },
          { Icon: Mic, label: "Interview", active: activeTabId === 2 },
          { Icon: BarChart2, label: "Analyze", active: activeTabId === 3 },
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
            <div
              className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-7 text-white transition-all duration-500 overflow-hidden"
              style={{
                background:
                  activeTabId === 1
                    ? "linear-gradient(to bottom right, #ea580c, #c2410c)"
                    : activeTabId === 2
                      ? "linear-gradient(to bottom right, #7c3aed, #5b21b6)"
                      : "linear-gradient(to bottom right, #0ea5e9, #0369a1)",
              }}
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/10 pointer-events-none" />

              <div
                className="relative z-10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
                key={activeTabId}
              >
                <div>
                  <p className="text-orange-100 text-[8px] sm:text-[10px] font-medium uppercase tracking-widest mb-1 opacity-90">
                    {activeTabId === 1
                      ? "Good morning, Sumit 👋"
                      : activeTabId === 2
                        ? "Role Targeting 🎯"
                        : "Career Boost 🚀"}
                  </p>
                  <h1 className="text-sm sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
                    {activeTabId === 1
                      ? "Welcome to Sumora AI"
                      : activeTabId === 2
                        ? "Custom Role Interviews"
                        : "Intelligent Resumes"}
                  </h1>
                  <p className="text-orange-50 text-[9px] sm:text-xs max-w-[200px] sm:max-w-xs leading-relaxed hidden sm:block opacity-90">
                    {activeTabId === 1
                      ? "Your AI-powered career co-pilot. Practice interviews, analyze your profile, and prepare smarter."
                      : activeTabId === 2
                        ? "Paste any job description and let AI simulate a rigorous technical interview strictly based on those requirements."
                        : "Upload your existing resume and let AI rewrite it to bypass ATS scanners and highlight matching keywords."}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white text-gray-900 font-semibold text-[9px] sm:text-xs shadow-lg whitespace-nowrap">
                  {activeTabId === 1 ? (
                    <Zap size={13} className="text-[#ea580c]" />
                  ) : activeTabId === 2 ? (
                    <Mic size={13} className="text-[#7c3aed]" />
                  ) : (
                    <BarChart2 size={13} className="text-[#0ea5e9]" />
                  )}
                  <span className="hidden sm:inline">
                    {activeTabId === 1
                      ? "Start Interview"
                      : activeTabId === 2
                        ? "New Interview"
                        : "Optimize Resume"}
                  </span>
                  <span className="sm:hidden">
                    {activeTabId === 1
                      ? "Start"
                      : activeTabId === 2
                        ? "New"
                        : "Scan"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Content Views based on activeTabId */}
            {activeTabId === 1 && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Interview Setup Mock */}
                <div className="bg-white dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-3 sm:p-5 shadow-sm">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 sm:mb-3">
                    How it works
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {[
                      "AI asks one focused question at a time",
                      "Answer using your microphone or by typing",
                      "Questions adapt based on your responses",
                      "Receive a full performance report at the end",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-gray-600 dark:text-gray-300"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#ea580c] flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#ea580c]/10 flex items-center justify-center">
                          <FileText
                            size={12}
                            className="text-[#ea580c] sm:hidden"
                          />
                          <FileText
                            size={16}
                            className="text-[#ea580c] hidden sm:block"
                          />
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-xs font-medium text-gray-900 dark:text-white">
                            Resume.pdf
                          </p>
                          <p className="text-[7px] sm:text-[10px] text-gray-500">
                            Optional • Improves context
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-[#ea580c] text-white text-[9px] sm:text-xs font-medium flex items-center gap-1.5">
                        <Mic size={12} /> Start Interview
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview Chat Mock */}
                <div className="bg-white dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-3 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-[8px] sm:text-[10px] font-bold flex items-center justify-center mt-0.5">
                      1
                    </span>
                    <p className="text-[10px] sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
                      Can you explain how you would optimize a React application
                      that is experiencing performance issues?
                    </p>
                  </div>
                  <div className="ml-6 sm:ml-7 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-gray-100 dark:border-[#222]">
                    <p className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      First, I would use React Developer Tools to profile the
                      component renders and identify any unnecessary re-renders.
                      Then, I'd implement useMemo and useCallback hooks where
                      appropriate...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabId === 2 && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Prepare Setup Mock */}
                <div className="bg-white dark:bg-[#161616] rounded-xl border border-gray-100 dark:border-[#2a2a2a] p-3 sm:p-5 shadow-sm space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen size={16} className="text-[#ea580c]" />
                    </div>
                    <div>
                      <h3 className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                        New Preparation Session
                      </h3>
                      <p className="text-[8px] sm:text-[10px] text-gray-500">
                        Select a subject, pick topics or type your own, then
                        start drilling.
                      </p>
                    </div>
                  </div>

                  {/* Subject Grid */}
                  <div className="space-y-2">
                    <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                      Subject
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          icon: Zap,
                          label: "Data Structures & Algorithms",
                          active: false,
                        },
                        {
                          icon: Monitor,
                          label: "Operating Systems",
                          active: true,
                        },
                        { icon: Database, label: "Databases", active: false },
                        {
                          icon: Globe,
                          label: "Computer Networks",
                          active: false,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border flex flex-col gap-1.5 sm:gap-2 transition-colors cursor-pointer ${item.active ? "border-[#ea580c] bg-[#ea580c]/5" : "border-gray-100 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-gray-600"}`}
                        >
                          <item.icon
                            size={12}
                            className={
                              item.active ? "text-[#ea580c]" : "text-gray-500"
                            }
                          />
                          <p
                            className={`text-[8px] sm:text-[9px] font-medium leading-tight ${item.active ? "text-[#ea580c]" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics Tags */}
                  <div className="space-y-2 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#111]">
                    <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                      Topics — pick one or more
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {[
                        { label: "Process Scheduling", active: true },
                        { label: "Deadlocks", active: true },
                        { label: "Virtual Memory", active: false },
                        { label: "Paging & Segmentation", active: false },
                        { label: "Threads & Concurrency", active: false },
                        { label: "File Systems", active: false },
                        { label: "Semaphores & Mutexes", active: false },
                      ].map((t, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-medium flex items-center gap-1 transition-colors ${t.active ? "bg-[#ea580c] text-white" : "bg-gray-200 dark:bg-[#222] text-gray-700 dark:text-gray-300"}`}
                        >
                          {t.label}{" "}
                          {t.active && (
                            <span className="opacity-70 hover:opacity-100">
                              <X size={8} />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[8px] sm:text-[9px] text-gray-400 bg-white dark:bg-[#161616] border border-gray-100 dark:border-[#2a2a2a] p-2 rounded-lg flex items-center justify-between">
                      <span>Or type a custom topic and press Enter...</span>
                      <span className="opacity-50">+ Add</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#222] text-gray-700 dark:text-gray-300 text-[9px] sm:text-xs font-medium flex items-center gap-1.5 border border-dashed border-gray-300 dark:border-gray-700">
                      <Upload size={12} /> Upload Resume PDF
                    </div>
                    <div className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-700 dark:text-gray-300 text-[9px] sm:text-xs font-medium flex items-center gap-1.5">
                      Interactive Mode
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTabId === 3 && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Analyze View Mock */}
                <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      width="110"
                      height="110"
                      viewBox="0 0 100 100"
                      className="text-gray-900 dark:text-white"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="9"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray="263.89"
                        strokeDashoffset="52.77"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="47"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="22"
                        fontWeight="700"
                        fill="currentColor"
                      >
                        80
                      </text>
                      <text
                        x="50"
                        y="62"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill="#9ca3af"
                      >
                        / 100
                      </text>
                    </svg>
                    <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      Strong Match
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 w-full">
                    {[
                      {
                        icon: CheckCircle,
                        title: "Keywords Matched",
                        val: "18 / 24",
                        color: "#10b981",
                        dColor: "text-emerald-500",
                      },
                      {
                        icon: AlertTriangle,
                        title: "Missing Skills",
                        val: "6 Skills",
                        color: "#f59e0b",
                        dColor: "text-amber-500",
                      },
                      {
                        icon: FileText,
                        title: "ATS Readability",
                        val: "Excellent",
                        color: "#0ea5e9",
                        dColor: "text-blue-500",
                      },
                      {
                        icon: Briefcase,
                        title: "Experience Fit",
                        val: "Senior Level",
                        color: "#7c3aed",
                        dColor: "text-purple-500",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]"
                      >
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-white dark:bg-[#222]`}
                        >
                          <stat.icon
                            size={12}
                            className={`sm:hidden ${stat.dColor}`}
                          />
                          <stat.icon
                            size={14}
                            className={`hidden sm:block ${stat.dColor}`}
                          />
                        </div>
                        <div>
                          <p className="text-[7px] sm:text-[9px] font-medium text-gray-500 uppercase tracking-wider">
                            {stat.title}
                          </p>
                          <p className="text-[10px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {stat.val}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 shadow-sm">
                  <p className="text-[11px] sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    AI Recommendations
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-[9px] sm:text-xs">
                      <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Add <b>"Docker"</b> and <b>"Kubernetes"</b> to your
                        skills section to match the containerization
                        requirements.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-[9px] sm:text-xs">
                      <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Quantify your achievements under the Senior Developer
                        role. For example, "Increased performance by X%".
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

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
