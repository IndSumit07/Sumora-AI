import { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mic,
  BarChart2,
  BookOpen,
  Sun,
  Moon,
  Menu,
  Home,
  Search,
  Bell,
  CreditCard,
  Zap,
} from "lucide-react";
import UserDropdown from "../components/UserDropdown";
import AccountModal from "../components/AccountModal";
import CommandPalette from "../components/CommandPalette";

const getInitials = (name) => (name || "SU").slice(0, 2).toUpperCase();

const NAV = [
  { to: "/dashboard", icon: Home, label: "Home", exact: true },
  { to: "/dashboard/interview", icon: Mic, label: "Interview" },
  { to: "/dashboard/analyze", icon: BarChart2, label: "Analyze" },
  { to: "/dashboard/prepare", icon: BookOpen, label: "Prepare" },
  { to: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const currentPage =
    NAV.find(({ to, exact }) =>
      exact ? location.pathname === to : location.pathname.startsWith(to),
    )?.label ?? "Dashboard";

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
      <div className="md:hidden fixed top-0 left-0 right-0 h-11 flex items-center justify-between px-3 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222] z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={17} />
          </button>
          <img src="/logo.png" alt="Sumora" className="h-5 w-auto" />
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            Sumora AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCmdOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
            aria-label="Search"
          >
            <Search size={15} />
          </button>
          <div className="relative">
            <Bell size={15} className="text-gray-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
          </div>

          <Link
            to="/dashboard/billing"
            className="hidden sm:flex items-center gap-1.5 bg-orange-50 dark:bg-[#ea580c]/10 text-[#ea580c] px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-orange-100 dark:hover:bg-[#ea580c]/20 transition-colors"
          >
            <Zap size={12} className="fill-[#ea580c]" />
            {user?.tokens || 0}
          </Link>

          <button
            onClick={() => setShowAccount(true)}
            className="w-7 h-7 rounded-full bg-[#ea580c] flex items-center justify-center text-[9px] font-bold text-white hover:bg-[#d24e0b] transition-colors"
          >
            {getInitials(user?.username)}
          </button>
        </div>
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
          <img src="/logo.png" alt="Sumora" className="h-12 w-auto" />
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
            onClick={() => setShowAccount(true)}
            title="Account"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
          >
            {getInitials(user?.username)}
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main className="flex-1 overflow-hidden flex flex-col pt-11 md:pt-0">
        {/* Desktop top navbar */}
        <header className="hidden md:flex items-center justify-between h-14 px-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#222] flex-shrink-0">
          {/* Left — logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sumora" className="h-7 w-auto" />
            <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
              Sumora AI
            </span>
            <span className="text-gray-300 dark:text-[#333] select-none">
              /
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {currentPage}
            </span>
          </div>

          {/* Right — search · bell · theme · user */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/billing"
              className="hidden sm:flex items-center gap-1.5 bg-orange-50 dark:bg-[#ea580c]/10 text-[#ea580c] px-3 h-8 mr-2 rounded-full text-xs font-bold hover:bg-orange-100 dark:hover:bg-[#ea580c]/20 transition-colors"
            >
              <Zap size={14} className="fill-[#ea580c]" />
              {user?.tokens || 0} Tokens
            </Link>

            {/* Search trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="relative flex items-center h-9 w-52 rounded-xl pl-8 pr-10 text-xs bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-400 dark:text-gray-600 hover:border-[#ea580c]/50 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-text"
            >
              <Search
                size={13}
                className="absolute left-3 pointer-events-none"
              />
              <span>Search…</span>
              <kbd className="absolute right-2.5 flex items-center gap-0.5 text-[10px] font-medium pointer-events-none">
                <span className="text-[9px]">⌘</span>K
              </kbd>
            </button>

            {/* Bell */}
            <div className="relative">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition-colors">
                <Bell size={17} />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ea580c] pointer-events-none" />
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition-colors"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 dark:bg-[#2a2a2a]" />

            {/* User dropdown */}
            <UserDropdown onManageAccount={() => setShowAccount(true)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};

export default DashboardPage;
