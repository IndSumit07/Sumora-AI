import { Menu } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

const routeTitles = {
  "/dashboard/new": "New Session",
  "/dashboard/sessions": "My Sessions",
};

const Navbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();

  let title = routeTitles[pathname];
  if (!title) {
    title = pathname.includes("/dashboard/sessions/")
      ? "Session Detail"
      : "Dashboard";
  }

  return (
    <header className="h-14 flex items-center gap-3 bg-white border-b border-gray-100 px-4 sm:px-6 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu size={18} />
      </button>

      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
    </header>
  );
};

export default Navbar;
