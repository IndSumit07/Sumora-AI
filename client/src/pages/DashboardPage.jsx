import { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mic, BarChart2, BookOpen, Sun, Moon, Menu, Home } from "lucide-react";

const getInitials = (name) => (name || "SU").slice(0, 2).toUpperCase();

const NAV = [
  { to: "/dashboard", icon: Home, label: "Home", exact: true },
  { to: "/dashboard/interview", icon: Mic, label: "Interview" },
  { to: "/dashboard/analyze", icon: BarChart2, label: "Analyze" },
  { to: "/dashboard/prepare", icon: BookOpen, label: "Prepare" },
];

const DashboardPage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

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
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-11 flex items-center px-3 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222] z-30">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={17} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Slim icon sidebar ── */}
      <aside
        className={[
          "fixed md:relative top-11 md:top-0 left-0 bottom-0 z-20",
          "w-16 md:w-20 flex flex-col items-center py-4 flex-shrink-0",
          "bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222]",
          "transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <Link
          to="/dashboard"
          className="flex items-center justify-center mb-8 flex-shrink-0"
        >
          <img src="/light_logo.png" alt="Sumora" className="h-8 w-auto dark:hidden" />
          <img src="/dark_logo.png" alt="Sumora" className="h-8 w-auto hidden dark:block" />
        </Link>

        <nav className="flex-1 flex flex-col gap-4 w-full px-2">
          {NAV.map(({ to, icon: Icon, label, exact }) => {
            const active = exact
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={label}
                onClick={() => setSidebarOpen(false)}
                className={[
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors",
                  active
                    ? "text-[#ea580c]"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222]",
                ].join(" ")}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
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

      {/* ── Main content area — no padding; views manage their own scrolling ── */}
      <main className="flex-1 overflow-hidden flex flex-col pt-11 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
