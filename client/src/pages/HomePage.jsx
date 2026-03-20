import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../components/UserDropdown";
import AccountModal from "../components/AccountModal";
import {
  Sun,
  Moon,
  Menu,
  X,
  Radio,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
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

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

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
          __html: `
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
      `,
        }}
      />

      <BackgroundGradient />

      {/* Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center py-4">
        <header className="relative flex h-[70px] items-center px-6 md:px-12 w-full max-w-[1500px] mx-auto bg-transparent border-transparent">
          {/* Logo */}
          <div className="flex-1 flex items-center gap-2.5 z-10 shrink-0">
            <img src="/logo.png" alt="Sumora" className="h-12 w-auto" />
            <span className="text-[19px] font-bold tracking-tight text-gray-900 dark:text-white">
              Sumora AI
            </span>
          </div>

          {/* Center Links (Capsule with single snake animation) */}
          <div className="hidden md:flex flex-none z-10 p-[1px] rounded-[30px] overflow-hidden absolute left-1/2 -translate-x-1/2">
            {/* Spinning single Snake background */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,#ea580c_100%)] opacity-100 z-0" />

            <nav className="relative z-10 flex items-center gap-8 px-8 py-[10px] rounded-[30px] text-[14px] font-medium text-gray-700 dark:text-gray-300 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md">
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Docs
              </a>
            </nav>
          </div>

          {/* Right Nav */}
          <div className="flex-1 flex justify-end items-center gap-3 z-10">
            <div className="flex items-center rounded-[30px] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 p-1 mr-2 backdrop-blur-md gap-1">
              <div
                onClick={() => setTheme("light")}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "light" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <Sun size={14} fill="currentColor" />
              </div>
              <div
                onClick={() => setTheme("dark")}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "dark" ? "bg-[#333] text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}
              >
                <Moon size={14} fill="currentColor" />
              </div>
            </div>

            {user ? (
              <UserDropdown onManageAccount={() => setShowAccount(true)} />
            ) : (
              <Link
                to="/login"
                className="hidden md:flex w-[36px] h-[36px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold items-center justify-center hover:opacity-80 transition-opacity text-sm"
              >
                S
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[82px] inset-x-0 z-40 md:hidden px-4">
          <nav className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-xl p-4 flex flex-col gap-1">
            {["Features", "Pricing", "Blog", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-[15px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {item}
              </a>
            ))}
            {!user && (
              <div className="mt-2 flex items-center justify-center w-full">
                <LiquidMetalButton
                  label="Get Started"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                />
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1 flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative pt-[120px] pb-12 flex flex-col items-center text-center px-4 w-full max-w-[1400px] mx-auto">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-500 dark:text-[#ab9b95] mb-6 uppercase">
            AI-POWERED INTERVIEW PREPARATION
          </p>
          <h1 className="text-[1.5rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] font-sans font-bold tracking-[-0.04em] text-gray-900 dark:text-[#ebe4de] max-w-2xl leading-[1.15] mb-4">
            Ace Your
            <br />
            Next Interview
            <br />
            with AI-Powered
            <br />
            Coaching
          </h1>
          <p className="text-gray-600 dark:text-[#a8a19b] max-w-[580px] mb-6 text-[17px] leading-[1.6]">
            Upload your resume or job description and get personalized
            behavioral &amp; technical questions, instant answer scoring, and a
            full preparation plan built by AI.
          </p>
          {user ? (
            <div className="mb-10 flex w-full justify-center">
              <LiquidMetalButton
                label="Go to Dashboard"
                onClick={() => navigate("/dashboard")}
              />
            </div>
          ) : (
            <div className="mb-10 flex w-full justify-center">
              <LiquidMetalButton
                label="Get Started"
                onClick={() => navigate("/login")}
              />
            </div>
          )}
        </section>

        <DashboardMockup />
        <IntegrationsSection />
        <FeatureSection />

        {/* Modes Section */}
        <section className="relative py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Interview Style
            </h2>
            <p className="text-gray-600 dark:text-[#a8a19b] max-w-2xl mx-auto text-lg leading-relaxed">
              Practice exactly how you want. Whether you're preparing for a
              conversational screening or a rigorous written assessment, Sumora
              adapts to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
            {/* Interactive Mode Card */}
            <div className="p-8 sm:p-10 rounded-[2rem] border border-gray-200 dark:border-[#2a2a2a] bg-white/40 dark:bg-[#161616]/40 backdrop-blur-md transition-all duration-300 hover:border-[#ea580c]/50 hover:bg-white/60 dark:hover:bg-[#161616]/60 group relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ea580c] opacity-[0.03] group-hover:opacity-[0.06] blur-3xl transition-opacity duration-500 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-[#ea580c]/10 text-[#ea580c] mb-6 sm:mb-8 shrink-0 shadow-inner">
                <Radio size={28} className="sm:hidden" />
                <Radio size={32} className="hidden sm:block" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Interactive Mode
              </h3>

              <p className="text-[15px] sm:text-[17px] text-gray-600 dark:text-[#a8a19b] mb-8 leading-relaxed flex-1">
                Experience a real-time conversational interview. The AI speaks
                to you naturally, listens to your voice, and generates
                intelligent follow-up questions dynamically based strictly on
                your answers.
              </p>

              <ul className="space-y-4 mt-auto border-t border-gray-100 dark:border-white/5 pt-8">
                {[
                  "Natural, low-latency conversational AI",
                  "Dynamic verbal follow-up questions",
                  "Builds speaking confidence under pressure",
                  "Simulates realistic recruiter interactions",
                ].map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3.5 text-[15px] text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <CheckCircle2 className="w-[22px] h-[22px] text-[#ea580c] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Analytic Mode Card */}
            <div className="p-8 sm:p-10 rounded-[2rem] border border-gray-200 dark:border-[#2a2a2a] bg-white/40 dark:bg-[#161616]/40 backdrop-blur-md transition-all duration-300 hover:border-[#0ea5e9]/50 hover:bg-white/60 dark:hover:bg-[#161616]/60 group relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9] opacity-[0.03] group-hover:opacity-[0.06] blur-3xl transition-opacity duration-500 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-[#0ea5e9]/10 text-[#0ea5e9] mb-6 sm:mb-8 shrink-0 shadow-inner">
                <MessageSquare size={28} className="sm:hidden" />
                <MessageSquare size={32} className="hidden sm:block" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Analytic Mode
              </h3>

              <p className="text-[15px] sm:text-[17px] text-gray-600 dark:text-[#a8a19b] mb-8 leading-relaxed flex-1">
                Take a rigorous written test without the time pressure. Read all
                your assigned interview questions at once, think through your
                structural reasoning thoughtfully, and receive detailed metrics.
              </p>

              <ul className="space-y-4 mt-auto border-t border-gray-100 dark:border-white/5 pt-8">
                {[
                  "Stress-free written answer formatting",
                  "Deep dive into your technical reasoning",
                  "Comprehensive post-answer analysis",
                  "Easily identify specific knowledge gaps",
                ].map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3.5 text-[15px] text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <CheckCircle2 className="w-[22px] h-[22px] text-[#0ea5e9] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <PricingSection />

        <FAQSection />

        <CommunitySection />

        <CTASection />
      </main>

      <Footer />

      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
    </div>
  );
};

export default HomePage;
