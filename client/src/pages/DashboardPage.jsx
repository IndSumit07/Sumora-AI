import { useState, useEffect } from "react";
import {
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInterview } from "../context/InterviewContext";
import {
  Layers,
  Plus,
  Sun,
  Moon,
  ChevronLeft,
  FileText,
  Mic,
  Menu,
} from "lucide-react";

const getInitials = (name) => (name || "SU").slice(0, 2).toUpperCase();

const DashboardPage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { sessions, getAllSessions } = useInterview();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  // Detect if we're inside a specific session workspace
  const sessionMatch = location.pathname.match(
    /\/dashboard\/sessions\/([^/]+)/,
  );
  const currentSessionId = sessionMatch?.[1] ?? null;
  const isInSession = !!currentSessionId;
  const currentSession = sessions?.find((s) => s._id === currentSessionId);
  const activeSection =
    new URLSearchParams(location.search).get("tab") || "reports";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (user) {
      getAllSessions().catch(console.error);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d0d0d]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white">
      {/* ── Slim icon sidebar — collapsible on mobile ── */}
      <aside
        className={`${sidebarOpen ? "w-16" : "w-0"} md:w-20 overflow-hidden transition-[width] duration-200 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex flex-col items-center py-4 flex-shrink-0 z-20`}
      >
        <Link
          to="/dashboard"
          className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center mb-8"
        >
          <span className="text-white font-bold text-lg">S</span>
        </Link>

        <nav className="flex-1 flex flex-col gap-4 w-full px-2">
          <Link
            to="/dashboard"
            title="All Sessions"
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
              !isInSession && location.pathname !== "/dashboard/new"
                ? "text-[#ea580c]"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222]"
            }`}
          >
            <Layers size={22} />
            <span className="text-[10px] font-medium">Sessions</span>
          </Link>

          <Link
            to="/dashboard/new"
            title="New Session"
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
              location.pathname === "/dashboard/new"
                ? "text-[#ea580c]"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222]"
            }`}
          >
            <Plus size={22} />
            <span className="text-[10px] font-medium">New</span>
          </Link>
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            title="Toggle Theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={logout}
            title="Logout"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors"
          >
            {getInitials(user?.username)}
          </button>
        </div>
      </aside>

      {/* ── Secondary sidebar: session nav — only when inside a session ── */}
      {isInSession && (
        <aside className="hidden md:flex w-64 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex-col flex-shrink-0 z-10">
          {/* Session identity */}
          <div className="p-4 border-b border-gray-200 dark:border-[#222]">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
              Session
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug truncate">
              {currentSession?.title ?? "Loading…"}
            </p>
            {currentSession?.jobTitle && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {currentSession.jobTitle}
              </p>
            )}
          </div>

          {/* Navigation items */}
          <nav className="p-2 flex flex-col gap-0.5 flex-1">
            {[
              { id: "reports", icon: FileText, label: "Reports" },
              { id: "interview", icon: Mic, label: "Live Interview" },
            ].map(({ id, icon: Icon, label }) => {
              const active = activeSection === id;
              return (
                <Link
                  key={id}
                  to={`/dashboard/sessions/${currentSessionId}?tab=${id}`}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-[#ea580c]/10 dark:bg-[#ea580c]/15 text-[#ea580c]"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-200",
                  ].join(" ")}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Back link */}
          <div className="p-4 border-t border-gray-100 dark:border-[#222]">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ChevronLeft size={14} />
              All Sessions
            </Link>
          </div>
        </aside>
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — non-session views only (hamburger to toggle sidebar) */}
        {!isInSession && (
          <div className="md:hidden flex-shrink-0 h-11 flex items-center px-3 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222]">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={17} />
            </button>
          </div>
        )}

        {/* Top navbar — only when inside a session */}
        {isInSession && (
          <header className="flex-shrink-0 h-12 flex items-center gap-2 px-4 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222]">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={17} />
            </button>
            <div className="md:hidden w-px h-5 bg-gray-200 dark:bg-[#333]" />
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
              title="Back to all sessions"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-[#333]" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {currentSession?.title ?? "Loading…"}
            </span>
          </header>
        )}

        {/* Mobile tab bar — visible only on small screens when inside a session */}
        {isInSession && (
          <div className="md:hidden flex-shrink-0 flex bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222]">
            {[
              { id: "reports", icon: FileText, label: "Reports" },
              { id: "interview", icon: Mic, label: "Live Interview" },
            ].map(({ id, icon: Icon, label }) => (
              <Link
                key={id}
                to={`/dashboard/sessions/${currentSessionId}?tab=${id}`}
                className={[
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
                  activeSection === id
                    ? "border-[#ea580c] text-[#ea580c]"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                ].join(" ")}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
