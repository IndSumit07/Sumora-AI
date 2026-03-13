import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserDropdown = ({ onManageAccount }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10 cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-[11px] font-bold text-white shadow-sm">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-200 pr-1 pl-1">
          {user.username}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`text-gray-400 mr-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {user.username}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
          <div className="p-1.5 flex flex-col gap-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // prevent losing focus or weird click drag issues
                setOpen(false);
                onManageAccount();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Settings size={15} className="text-gray-400" />
              Manage account
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
