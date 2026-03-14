import { NavLink } from "react-router-dom";
import { Plus, Layers, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SunburstIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const navItems = [
  { to: "/dashboard/new", icon: Plus, label: "New Session" },
  { to: "/dashboard/sessions", icon: Layers, label: "My Sessions" },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const initials = (user?.username || "SU").slice(0, 2).toUpperCase();

  return (
    <div className="w-64 h-screen flex flex-col bg-[#0a0a0a] relative overflow-hidden select-none">
      {/* Subtle orange glow corner */}
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="px-6 h-14 flex items-center gap-3 border-b border-white/5 flex-shrink-0">
        <div className="text-[#ea580c]">
          <SunburstIcon />
        </div>
        <span className="text-white font-semibold text-[15px] tracking-tight">
          Sumora AI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">
          Workspace
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            end={to === "/dashboard/new"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#ea580c]/15 text-[#ea580c]"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              ].join(" ")
            }
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/5 relative z-10 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="h-7 w-7 rounded-full bg-[#ea580c] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate leading-tight">
              {user?.username}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
