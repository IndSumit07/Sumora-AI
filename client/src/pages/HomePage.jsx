import { memo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../components/UserDropdown";
import AccountModal from "../components/AccountModal";
import { Sun, Moon, Menu, X } from "lucide-react";
import BackgroundGradient from "../components/home/BackgroundGradient";
import DashboardMockup from "../components/home/DashboardMockup";
import IntegrationsSection from "../components/home/IntegrationsSection";
import FeatureSection from "../components/home/FeatureSection";
import CommunitySection from "../components/home/CommunitySection";
import PricingSection from "../components/home/PricingSection";
import FAQSection from "../components/home/FAQSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import Footer from "../components/home/Footer";
import { LiquidMetalButton } from "../components/ui/liquid-metal-button";
import { InteractiveNebulaShader } from "../components/ui/liquid-shader";
import DatabaseWithRestApi from "../components/ui/database-with-rest-api";
import { FadeIn } from "../components/ui/fade-in";

const HOME_STYLE = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 25s linear infinite;
    width: max-content;
  }
  @keyframes beam {
    0%, 100% { transform: translateX(-50%) rotate(-2deg); opacity: 0.7; }
    50% { transform: translateX(-50%) rotate(2deg); opacity: 1; }
  }
  .animate-beam {
    animation: beam 8s ease-in-out infinite;
    transform-origin: top center;
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.6; transform: translateX(-50%) scale(1.05); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 5s ease-in-out infinite;
  }
`;

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

const StaticHomeSections = memo(function StaticHomeSections() {
  return (
    <>
      <FadeIn>
        <DashboardMockup />
      </FadeIn>

      <FadeIn delay={0.1}>
        <IntegrationsSection />
      </FadeIn>

      <section id="features" className="scroll-mt-28">
        <FadeIn>
          <FeatureSection />
        </FadeIn>
      </section>

      <section className="relative py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10 flex flex-col items-center">
        <FadeIn className="text-center mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Models Pointing Forward
          </h2>
          <p className="text-gray-600 dark:text-[#a8a19b] text-lg leading-relaxed">
            Sumora uniquely integrates the absolute best-in-class multi-modal AI
            to guarantee your interviews are flawless and lightning-fast.
          </p>
        </FadeIn>
        <FadeIn delay={0.2} className="flex justify-center w-full">
          <DatabaseWithRestApi />
        </FadeIn>
      </section>

      <FadeIn>
        <HowItWorksSection />
      </FadeIn>

      <section id="pricing" className="scroll-mt-28">
        <FadeIn>
          <PricingSection />
        </FadeIn>
      </section>

      <section id="faq" className="scroll-mt-28">
        <FadeIn>
          <FAQSection />
        </FadeIn>
      </section>

      <section id="community" className="scroll-mt-28">
        <FadeIn>
          <CommunitySection />
        </FadeIn>
      </section>

      <FadeIn>
        <CTASection />
      </FadeIn>
    </>
  );
});

const HomeNavbar = memo(function HomeNavbar({
  user,
  theme,
  mobileMenuOpen,
  onSetThemeLight,
  onSetThemeDark,
  onManageAccount,
  onLogin,
  onToggleMobileMenu,
  onCloseMobileMenu,
}) {
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center py-4">
        <header className="relative flex h-[70px] items-center px-4 sm:px-6 md:px-12 w-full max-w-[1500px] mx-auto bg-transparent border-transparent">
          <div className="flex-1 flex items-center gap-2 z-10 shrink-0 min-w-0">
            <img src="/logo.png" alt="Sumora" className="h-10 sm:h-12 w-auto" />
            <span className="hidden sm:block text-[19px] font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
              Sumora AI
            </span>
          </div>

          <div className="hidden md:flex flex-none z-30 p-[1px] rounded-[30px] overflow-hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,#ea580c_100%)] opacity-100 z-0 pointer-events-none" />

            <nav className="relative z-10 pointer-events-auto flex items-center gap-8 px-8 py-[10px] rounded-[30px] text-[14px] font-medium text-gray-700 dark:text-gray-300 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md">
              <a
                href="#features"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#community"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Community
              </a>
              <a
                href="#faq"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3 z-10 min-w-0">
            <div className="flex items-center rounded-[30px] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 p-1 backdrop-blur-md gap-1">
              <button
                type="button"
                aria-label="Switch to light theme"
                onClick={onSetThemeLight}
                className={`w-7 h-7 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "light" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <Sun size={14} fill="currentColor" />
              </button>
              <button
                type="button"
                aria-label="Switch to dark theme"
                onClick={onSetThemeDark}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "dark" ? "bg-[#333] text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}
              >
                <Moon size={14} fill="currentColor" />
              </button>
            </div>

            {user ? (
              <UserDropdown onManageAccount={onManageAccount} compact />
            ) : (
              <div className="hidden md:flex items-center">
                <LiquidMetalButton label="Login" onClick={onLogin} />
              </div>
            )}

            <button
              onClick={onToggleMobileMenu}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
      </div>

      {mobileMenuOpen && (
        <div className="fixed top-[82px] inset-x-0 z-40 md:hidden px-4">
          <nav className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-xl p-4 flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onCloseMobileMenu}
                className="flex items-center px-4 py-3 rounded-xl text-[15px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {!user && (
              <div className="mt-2 flex items-center justify-center w-full">
                <LiquidMetalButton
                  label="Get Started"
                  onClick={() => {
                    onCloseMobileMenu();
                    onLogin();
                  }}
                />
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
});

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const openAccountModal = useCallback(() => {
    setShowAccount(true);
  }, []);

  const goToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const setLightTheme = useCallback(() => {
    setTheme("light");
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme("dark");
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((open) => !open);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-white relative flex flex-col bg-white dark:bg-[#0e0a09] selection:bg-[#ea580c] selection:text-gray-900 dark:selection:text-white overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: HOME_STYLE,
        }}
      />

      <BackgroundGradient />

      <HomeNavbar
        user={user}
        theme={theme}
        mobileMenuOpen={mobileMenuOpen}
        onSetThemeLight={setLightTheme}
        onSetThemeDark={setDarkTheme}
        onManageAccount={openAccountModal}
        onLogin={goToLogin}
        onToggleMobileMenu={toggleMobileMenu}
        onCloseMobileMenu={closeMobileMenu}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1 flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative pt-[120px] pb-12 flex flex-col items-center justify-center text-center px-4 w-full max-w-[1400px] mx-auto min-h-[70vh]">
          {/* Centered Liquid background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] max-w-[100vw] max-h-[100vh] -z-10 rounded-full overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]">
            <InteractiveNebulaShader
              isDark={theme === "dark"}
              disableCenterDimming={true}
              className="w-full h-full opacity-100 mix-blend-plus-lighter"
            />
          </div>

          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-500 dark:text-[#ab9b95] mb-6 uppercase relative z-10">
            AI-POWERED INTERVIEW PREPARATION
          </p>
          <h1 className="text-[1.5rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] font-sans font-bold tracking-[-0.04em] text-gray-900 dark:text-[#ebe4de] max-w-2xl leading-[1.15] mb-4 relative z-10">
            Ace Your
            <br />
            Next Interview
            <br />
            with AI-Powered
            <br />
            Coaching
          </h1>
          <p className="text-gray-600 dark:text-[#a8a19b] max-w-[580px] mb-6 text-[17px] leading-[1.6] relative z-10">
            Upload your resume or job description and get personalized
            behavioral &amp; technical questions, instant answer scoring, and a
            full preparation plan built by AI.
          </p>
          {user ? (
            <div className="mb-10 flex w-full justify-center relative z-10">
              <LiquidMetalButton
                label="Go to Dashboard"
                onClick={() => navigate("/dashboard")}
              />
            </div>
          ) : (
            <div className="mb-10 flex w-full justify-center relative z-10">
              <LiquidMetalButton
                label="Get Started"
                onClick={() => navigate("/login")}
              />
            </div>
          )}
        </section>

        <StaticHomeSections />
      </main>

      <Footer />

      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
    </div>
  );
};

export default HomePage;
