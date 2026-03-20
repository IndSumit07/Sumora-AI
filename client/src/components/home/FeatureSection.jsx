import { useState } from "react";
import { ArrowRight } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const features = [
  {
    id: 1,
    title: (
      <>
        Meet <span className="text-[#ea580c]">Sumora AI</span>: Your personal
        interview coach.
      </>
    ),
    description:
      "Sumora isn't just any AI. It's AI that knows your career goals inside and out. It adapts to your job title, generates targeted questions, scores your answers, and helps you land the role.",
    linkText: "Learn more about Sumora AI",
  },
  {
    id: 2,
    title: "Personalized questions for any role.",
    description:
      "Practice with interviews tailored specifically to your exact target role. Our AI analyzes the job description and generates realistic, industry-specific questions to test your skills.",
    linkText: "Explore interview modes",
  },
  {
    id: 3,
    title: "AI-generated resume tailored to the job.",
    description:
      "Stop sending the same generic resume. Sumora instantly highlights your most relevant experience to match the exact keywords and skills hiring managers are looking for.",
    linkText: "Discover resume tools",
  },
];

const FeatureSection = () => {
  const [activeFeature, setActiveFeature] = useState(1);

  return (
    <section className="py-20 px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
      <div className="space-y-12 shrink-0">
        <div className="space-y-6">
          {features.map((feature) => {
            const isActive = activeFeature === feature.id;

            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`border-l-2 pl-6 py-1 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-[#ea580c] opacity-100"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <h2
                  className={`font-semibold text-gray-900 dark:text-white transition-all duration-300 ${
                    isActive
                      ? "text-3xl sm:text-4xl mb-4 pr-4"
                      : "text-xl sm:text-2xl"
                  }`}
                >
                  {feature.title}
                </h2>

                {isActive && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-gray-600 dark:text-[#a8a19b] text-lg mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center text-[#ea580c] font-medium hover:text-[#c2410c] transition-colors gap-2"
                    >
                      {feature.linkText} <ArrowRight size={16} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stat */}
        <div className="pt-8">
          <h3 className="text-6xl sm:text-[5.5rem] font-sans font-bold text-gray-900 dark:text-[#ebe4de] tracking-tight mb-2">
            3x
          </h3>
          <p className="text-base font-semibold text-gray-900 dark:text-[#ebe4de] max-w-[280px] leading-snug">
            Higher interview success rate for users who practice with Sumora AI¹
          </p>
        </div>
      </div>

      {/* Full Dashboard preview */}
      <div className="relative h-[760px] hidden lg:block">
        <DashboardMockup
          activeTabId={activeFeature}
          className="absolute inset-y-0 left-0 right-[-55%] rounded-l-[24px] rounded-r-none border border-r-0 border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-0 shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500"
          style={{
            maskImage: "linear-gradient(to bottom, black 60%, transparent 90%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 90%)",
          }}
        />
      </div>
    </section>
  );
};

export default FeatureSection;
