import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const AuthLayout = ({ leftText, heading, subheading, children, footer }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return false;
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

  return (
    <div className="min-h-screen flex items-stretch sm:items-center justify-center p-0 sm:p-8 bg-white dark:bg-[#0f0f0f]">
      {/* Floating theme toggle */}
      <button
        onClick={() => setIsDark((d) => !d)}
        title="Toggle theme"
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="flex w-full max-w-none sm:max-w-[1000px] bg-white dark:bg-[#0f0f0f] rounded-none sm:rounded-[2rem] overflow-hidden shadow-none sm:shadow-2xl min-h-screen sm:min-h-[600px]">
        {/* Left panel — always dark */}
        <div className="hidden lg:flex w-1/2 bg-[#090909] m-3 rounded-[1.5rem] flex-col justify-between p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-[2.5rem] leading-[1.1] font-medium text-white mb-2 tracking-tight">
              {leftText}
            </h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-end justify-center gap-4 opacity-80 pointer-events-none">
            <div className="w-16 h-full bg-gradient-to-t from-[#ea580c] to-transparent blur-2xl" />
            <div className="w-24 h-[80%] bg-gradient-to-t from-[#ea580c] to-transparent blur-3xl opacity-70" />
            <div className="w-20 h-full bg-gradient-to-t from-[#ea580c] to-transparent blur-2xl opacity-90" />
            <div className="w-16 h-[60%] bg-gradient-to-t from-[#f97316] to-transparent blur-3xl opacity-60" />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center px-3 sm:px-8 lg:px-16 py-5 sm:py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <img src="/logo.png" alt="Sumora" className="h-14 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sumora AI
            </span>
          </div>

          {/* Heading */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[2rem] font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
              {heading}
            </h1>
            <p className="text-gray-400 text-sm">{subheading}</p>
          </div>

          <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-5 sm:mb-8" />

          {/* Page-specific form content */}
          {children}

          {/* Footer */}
          {footer && (
            <p className="mt-6 text-center text-sm text-gray-400">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
