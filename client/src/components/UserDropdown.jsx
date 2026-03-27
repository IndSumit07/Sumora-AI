import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

/**
 * UserDropdown
 *
 * Props:
 *  onManageAccount — () => void
 *  compact         — avatar + chevron pill (mobile top bar)
 *  sidebar         — plain round avatar button (slim sidebar)
 *  dropUp          — menu opens upward
 */
const UserDropdown = ({
  onManageAccount,
  compact = false,
  sidebar = false,
  dropUp = false,
}) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  if (!user) return null;

  const initials = (user.username || "SU").slice(0, 2).toUpperCase();

  /* ── Shared dropdown panel ──────────────────────────────────────── */
  const Panel = () => (
    <div
      className={[
        "absolute z-50 w-56 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10",
        "bg-white dark:bg-[#1A1A1A] shadow-2xl backdrop-blur-xl",
        dropUp || sidebar ? "bottom-full mb-2" : "top-full mt-2",
        sidebar ? "left-0" : "right-0",
      ].join(" ")}
    >
      {/* User info */}
      <div className="border-b border-black/10 dark:border-white/10 px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {user.username}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        {/* Token balance link */}
        <Link
          to="/dashboard/billing"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-[#ea580c]/10 hover:bg-orange-100 dark:hover:bg-[#ea580c]/20 transition-colors"
        >
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Token balance
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-[#ea580c]">
            <Zap size={11} className="fill-[#ea580c]" />
            {user?.tokens ?? 0} tokens
          </span>
        </Link>
      </div>

      {/* Actions */}
      <div className="p-1.5 flex flex-col gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen(false);
            onManageAccount();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Settings size={15} className="text-gray-500 dark:text-gray-400" />
          Manage account
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );

  /* ── Sidebar: plain round avatar ────────────────────────────────── */
  if (sidebar) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          title={user.username}
          className={[
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
            open
              ? "bg-[#ea580c] text-white shadow-md"
              : "bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-[#ea580c] hover:text-[#ea580c]",
          ].join(" ")}
        >
          {initials}
        </button>
        {open && <Panel />}
      </div>
    );
  }

  /* ── Compact: small pill for mobile bar ─────────────────────────── */
  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 px-1.5 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-[11px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <svg
            width="12" height="12" viewBox="0 0 12 12"
            className={`text-gray-600 dark:text-gray-400 mr-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && <Panel />}
      </div>
    );
  }

  /* ── Default: full pill with username for desktop top bar ────────── */
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-[11px] font-bold text-white shadow-sm">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 px-1">
          {user.username}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          className={`text-gray-600 dark:text-gray-400 mr-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <Panel />}
    </div>
  );
};

export default UserDropdown;
