import {
  Layers,
  Plus,
  Sun,
  FileText,
  Mic,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Calendar,
  Briefcase,
  User,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ── Tiny SVG score ring (matches real MatchScoreRing) ─────────────────────────
const ScoreRing = ({ score, stroke }) => {
  const R = 38;
  const C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle
        cx="48"
        cy="48"
        r={R}
        fill="none"
        stroke="#ffffff15"
        strokeWidth="8"
      />
      <circle
        cx="48"
        cy="48"
        r={R}
        fill="none"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="45"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        fontWeight="700"
        fill="#fff"
      >
        {score}
      </text>
      <text
        x="48"
        y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fill="#9ca3af"
      >
        / 100
      </text>
    </svg>
  );
};

const defaultClass =
  "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
const defaultStyle = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
};

const DashboardMockup = ({ className, style } = {}) => (
  <div className={className ?? defaultClass} style={style ?? defaultStyle}>
    <div className="rounded-[18px] border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0d0d0d] flex h-[300px] sm:h-[500px] lg:h-[750px] overflow-hidden">
      {/* ── Slim icon sidebar ── */}
      <aside className="w-[44px] sm:w-[68px] bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex flex-col items-center py-3 sm:py-4 flex-shrink-0">
        {/* Logo */}
        <div className="w-7 h-7 sm:w-10 sm:h-10 bg-[#ea580c] rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-8">
          <span className="text-white font-bold text-xs sm:text-lg">S</span>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full px-1 sm:px-2">
          <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl text-[#ea580c]">
            <Layers size={15} className="sm:hidden" />
            <Layers size={20} className="hidden sm:block" />
            <span className="text-[7px] sm:text-[9px] font-medium hidden sm:block">
              Sessions
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl text-gray-400">
            <Plus size={15} className="sm:hidden" />
            <Plus size={20} className="hidden sm:block" />
            <span className="text-[7px] sm:text-[9px] font-medium hidden sm:block">
              New
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-400">
            <Sun size={13} className="sm:hidden" />
            <Sun size={18} className="hidden sm:block" />
          </div>
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-[9px] sm:text-xs font-bold text-gray-300">
            JD
          </div>
        </div>
      </aside>

      {/* ── Session nav sidebar — hidden on mobile ── */}
      <aside className="hidden sm:flex w-[180px] lg:w-[220px] bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex-col flex-shrink-0">
        {/* Session identity */}
        <div className="p-4 border-b border-gray-200 dark:border-[#222]">
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            Session
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug truncate">
            Frontend Engineer
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            Acme Corp · 2025
          </p>
        </div>

        {/* Nav tabs */}
        <nav className="p-2 flex flex-col gap-0.5 flex-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#ea580c]/10 text-[#ea580c]">
            <FileText size={15} className="flex-shrink-0" />
            <span className="text-sm font-medium">Reports</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400">
            <Mic size={15} className="flex-shrink-0" />
            <span className="text-sm font-medium">Live Interview</span>
          </div>
        </nav>

        {/* Back link */}
        <div className="p-4 border-t border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ChevronLeft size={13} />
            All Sessions
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex-shrink-0 h-12 flex items-center gap-3 px-4 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400">
            <ChevronLeft size={16} />
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-[#333]" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            Frontend Engineer
          </span>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Session info card */}
          <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-4 shadow-sm flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
              <FileText size={15} className="text-[#ea580c]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                Frontend Engineer @ Acme Corp
              </h2>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                React, TypeScript, performance optimization, component
                architecture…
              </p>
            </div>
          </div>

          {/* Reports list header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Reports
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">2 reports</p>
            </div>
            <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-[#ea580c] text-xs font-medium text-white">
              <Plus size={12} />
              New Report
            </div>
          </div>

          {/* Report card 1 — active/selected */}
          <div className="bg-white dark:bg-[#161616] rounded-2xl border border-[#ea580c]/30 p-4 shadow-sm flex items-center gap-4 cursor-pointer">
            <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
              <span className="text-sm font-bold text-[#ea580c]">82</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Frontend Engineer Prep Report
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={10} />
                  Mar 14, 2025
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  Strong Match
                </span>
              </div>
            </div>
            <ChevronRight size={14} className="text-[#ea580c] flex-shrink-0" />
          </div>

          {/* Report card 2 */}
          <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#ea580c]/30 transition-all">
            <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
              <span className="text-sm font-bold text-[#ea580c]">67</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Frontend Engineer Prep Report
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={10} />
                  Mar 10, 2025
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  Good Match
                </span>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
          </div>

          {/* Expanded report detail preview */}
          <div className="space-y-3">
            {/* Dark header */}
            <div className="bg-[#0a0a0a] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ea580c] mb-1">
                    Interview Report
                  </p>
                  <h2 className="text-base font-semibold text-white mb-1">
                    Frontend Engineer Prep Report
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={10} />
                    Generated Mar 14, 2025
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={82} stroke="#22c55e" />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      Strong Match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium">
                    <Download size={12} />
                    Download PDF
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Questions accordion */}
            <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-[#ea580c]" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Technical Questions
                  </span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  8
                </span>
              </div>
              <div className="p-3 space-y-2">
                {[
                  "Explain the difference between controlled and uncontrolled components in React.",
                  "How would you optimize a React app that renders a large list of items?",
                  "Describe your approach to managing global state in a large-scale application.",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-[#161616]">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 leading-snug truncate">
                          {q}
                        </span>
                      </div>
                      <ChevronDown
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-[#ea580c]" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Skill Gaps
                  </span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                  3
                </span>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {[
                  {
                    skill: "System Design",
                    sev: "bg-red-50 text-red-600 border-red-200",
                  },
                  {
                    skill: "Testing (Vitest)",
                    sev: "bg-amber-50 text-amber-700 border-amber-200",
                  },
                  {
                    skill: "Web Performance",
                    sev: "bg-amber-50 text-amber-700 border-amber-200",
                  },
                ].map((sg, i) => (
                  <span
                    key={i}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${sg.sev}`}
                  >
                    {sg.skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Prep Plan teaser */}
            <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#ea580c]" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Preparation Plan
                  </span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 px-2 py-0.5 rounded-full">
                  7 days
                </span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { day: 1, focus: "Core React Concepts & Hooks" },
                  { day: 2, focus: "State Management & Performance" },
                  { day: 3, focus: "System Design Fundamentals" },
                ].map((d, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="h-7 w-7 rounded-full bg-[#ea580c] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {d.day}
                        </span>
                      </div>
                      {i < 2 && (
                        <div className="w-px flex-1 bg-gray-200 dark:bg-[#333] mt-1" />
                      )}
                    </div>
                    <div className="pb-3 flex-1">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {d.focus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMockup;
