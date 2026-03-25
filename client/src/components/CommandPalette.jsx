import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Mic,
  BarChart2,
  BookOpen,
  Search,
  CreditCard,
  Activity,
} from "lucide-react";

const ITEMS = [
  {
    to: "/dashboard",
    icon: Home,
    label: "Home",
    description: "Dashboard overview",
  },
  {
    to: "/dashboard/interview",
    icon: Mic,
    label: "Interview",
    description: "AI mock interviews",
  },
  {
    to: "/dashboard/analyze",
    icon: BarChart2,
    label: "Analyze",
    description: "Resume & job analysis",
  },
  {
    to: "/dashboard/prepare",
    icon: BookOpen,
    label: "Prepare",
    description: "Study & preparation",
  },
  {
    to: "/dashboard/stats",
    icon: Activity,
    label: "Stats",
    description: "Performance and activity analytics",
  },
  {
    to: "/dashboard/billing",
    icon: CreditCard,
    label: "Pricing",
    description: "Plans, tokens & billing",
  },
];

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const filtered = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const go = (to) => {
    navigate(to);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[activeIndex]) go(filtered[activeIndex].to);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#161616] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2a2a2a] overflow-hidden">
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-[#222]">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages…"
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
          <kbd className="text-[10px] font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#222] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#2a2a2a]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="py-1.5 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-10">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              const active = i === activeIndex;
              return (
                <button
                  key={item.to}
                  onClick={() => go(item.to)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={[
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    active
                      ? "bg-[#ea580c]/10"
                      : "hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
                  ].join(" ")}
                >
                  {/* Icon badge */}
                  <div
                    className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      active
                        ? "bg-[#ea580c] text-white"
                        : "bg-gray-100 dark:bg-[#222] text-gray-500 dark:text-gray-400",
                    ].join(" ")}
                  >
                    <Icon size={15} />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        active
                          ? "text-[#ea580c]"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {item.description}
                    </div>
                  </div>

                  {/* Enter hint */}
                  {active && (
                    <kbd className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#222] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#2a2a2a] flex-shrink-0">
                      ↵
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 dark:border-[#222]">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-600">
            <kbd className="bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#2a2a2a] rounded px-1 py-0.5">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-600">
            <kbd className="bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#2a2a2a] rounded px-1 py-0.5">
              ↵
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-600">
            <kbd className="bg-gray-100 dark:bg-[#222] border border-gray-200 dark:border-[#2a2a2a] rounded px-1 py-0.5">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
