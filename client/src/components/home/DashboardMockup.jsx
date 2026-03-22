import { useState, useEffect } from "react";

const defaultClass =
  "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
const defaultStyle = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
};

const DashboardMockup = ({ className, style, activeTabId = 1 } = {}) => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true,
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const images = {
    dark: {
      1: "/dashboard_home.png",
      2: "/dashboard_interview.png",
      3: "/dashboard_prepare.png",
    },
    light: {
      1: "/dashboard_home_light.png",
      2: "/dashboard_interview_light.png",
      3: "/dashboard_prepare_light.png",
    },
  };

  const currentTheme = isDark ? "dark" : "light";
  const currentImage =
    images[currentTheme][activeTabId] || images[currentTheme][1];

  return (
    <div className={className ?? defaultClass} style={style ?? defaultStyle}>
      <div className="rounded-[18px] border border-gray-200 dark:border-white/5 overflow-hidden transition-all duration-500 shadow-xl flex bg-gray-50 dark:bg-[#0d0d0d]">
        <img
          src={currentImage}
          alt={`Dashboard view ${activeTabId}`}
          className="w-full h-auto object-cover object-left-top transition-opacity duration-500"
        />
      </div>
    </div>
  );
};

export default DashboardMockup;
