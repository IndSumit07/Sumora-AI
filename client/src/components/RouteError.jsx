import { useRouteError, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center p-6 text-center shadow-lg">
      <div className="max-w-md w-full bg-gray-50 dark:bg-[#151515] p-8 rounded-3xl border border-gray-100 dark:border-[#222]">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          Oops! Something broke.
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          {error?.message || error?.statusText || "An unexpected error occurred while rendering the page."}
        </p>

        <div className="bg-gray-100 dark:bg-black/50 p-4 rounded-xl text-left text-xs text-gray-400 font-mono overflow-auto max-h-32 mb-8 hidden shadow-inner md:block">
          {error?.stack?.split("\n").slice(0, 3).join("\n") || "No detailed stack trace available."}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all"
          >
            <RotateCcw size={15} />
            Go Back
          </button>
          
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ea580c] text-white text-sm font-semibold hover:bg-[#d24e0b] shadow-sm transition-all"
          >
            <Home size={15} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteError;
