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
  MessageSquare,
  Layers,
  Plus,
  Search,
  Bell,
  MoreHorizontal,
  FileText,
  Sun,
  Moon,
} from "lucide-react";

const getInitials = (name) => (name || "SU").slice(0, 2).toUpperCase();

// Score formatting from reports list view
const getScoreColor = (s) =>
  s >= 75 ? "#16a34a" : s >= 50 ? "#d97706" : "#dc2626";

const DashboardPage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { sessions, getAllSessions } = useInterview();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

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

  const filteredSessions = sessions?.filter((s) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white">
      {/* 1. Left Slim Sidebar */}
      <aside className="w-16 md:w-20 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex flex-col items-center py-4 flex-shrink-0 z-20">
        <Link
          to="/"
          className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center mb-8"
        >
          <span className="text-gray-900 dark:text-white font-bold text-lg">
            S
          </span>
        </Link>

        <nav className="flex-1 flex flex-col gap-4 w-full px-2">
          <Link
            to="/dashboard/new"
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
              location.pathname === "/dashboard/new"
                ? "text-[#ea580c]"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-[#222]"
            }`}
          >
            <MessageSquare
              size={22}
              fill={
                location.pathname === "/dashboard/new" ? "currentColor" : "none"
              }
            />
            <span className="text-[10px] font-medium">Practice</span>
          </Link>

          <Link
            to="/dashboard/sessions"
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
              location.pathname.startsWith("/dashboard/sessions") &&
              location.pathname !== "/dashboard/sessions/new"
                ? "text-[#ea580c]"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-[#222]"
            }`}
          >
            <Layers
              size={22}
              fill={
                location.pathname.startsWith("/dashboard/sessions")
                  ? "currentColor"
                  : "none"
              }
            />
            <span className="text-[10px] font-medium">Sessions</span>
          </Link>
        </nav>

        {/* User Theme/Logout toggle */}
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
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-red-500 transition-colors"
          >
            {getInitials(user?.username)}
          </button>
        </div>
      </aside>

      {/* 2. Secondary Sidebar (Sessions List) */}
      <aside className="hidden md:flex w-80 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] flex-col flex-shrink-0 z-10">
        <div className="p-4 border-b border-gray-200 dark:border-[#222]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Sessions
            </h2>
            <Link
              to="/dashboard/new"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
            >
              <Plus size={20} />
            </Link>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 px-1">
              MY SESSIONS
            </h3>
            <div className="space-y-1">
              {filteredSessions?.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                  No sessions found
                </div>
              ) : (
                filteredSessions?.map((session) => {
                  const isActive =
                    location.pathname === `/dashboard/sessions/${session._id}`;
                  const score = session.report?.score || 0;
                  return (
                    <Link
                      key={session._id}
                      to={`/dashboard/sessions/${session._id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-gray-100 dark:bg-[#222] ring-1 ring-gray-200 dark:ring-[#333]"
                          : "hover:bg-gray-50 dark:bg-[#1a1a1a]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-[#ea580c]" : "bg-gray-200 dark:bg-[#2a2a2a]"}`}
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {getInitials(session.title)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            # {session.title}
                          </h4>
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                            {new Date(session.createdAt).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-400 truncate">
                          {score > 0 ? `Score: ${score}%` : "Not started yet"}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Main Layout Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50 dark:bg-[#0d0d0d] p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
