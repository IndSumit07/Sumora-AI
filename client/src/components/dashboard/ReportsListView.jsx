import { FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ReportsListView = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-[#0d0d0d] text-center p-6 mt-20">
      <div className="h-16 w-16 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
        <FileText size={28} className="text-[#ea580c]" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Select a session
      </h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Choose a session from the sidebar to view its details, or create a new one to get started with an AI interview.
      </p>
      <Link
        to="/dashboard/new"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ea580c] text-sm font-semibold text-gray-900 dark:text-white hover:bg-[#d24e0b] transition-colors"
      >
        <Sparkles size={16} />
        Create New Session
      </Link>
    </div>
  );
};

export default ReportsListView;
