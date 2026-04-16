import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const defaultClass =
  "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/10 dark:bg-[#161616]/10 p-2 sm:p-4 shadow-2xl relative overflow-hidden -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
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
  const frameRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

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

  useEffect(() => {
    if (!frameRef.current) return;

    const nodes = frameRef.current.querySelectorAll("[data-tab-image]");
    nodes.forEach((node) => {
      const tab = Number(node.getAttribute("data-tab-image"));
      const isActive = tab === activeTabId;

      gsap.to(node, {
        opacity: isActive ? 1 : 0,
        duration: isActive ? 0.45 : 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [activeTabId, currentTheme]);

  return (
    <div className={className ?? defaultClass} style={style ?? defaultStyle}>
      <div
        ref={frameRef}
        className="rounded-[18px] border border-gray-200 dark:border-white/5 overflow-hidden transition-all duration-300 shadow-xl flex bg-gray-50 dark:bg-[#0d0d0d] relative"
      >
        {[1, 2, 3].map((tab) => (
          <img
            key={`${currentTheme}-${tab}`}
            data-tab-image={tab}
            src={images[currentTheme][tab]}
            alt={`Dashboard view ${tab}`}
            className={`w-full h-auto object-cover object-left-top ${
              tab === 1 ? "relative" : "absolute inset-0"
            }`}
            loading={tab === 1 ? "eager" : "lazy"}
            decoding="async"
            style={{ opacity: tab === activeTabId ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardMockup;
