import { ArrowRight } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const FeatureSection = () => (
  <section className="py-20 px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
    <div className="space-y-12 shrink-0">
      {/* Feature 1 - Active */}
      <div className="border-l-2 border-[#ea580c] pl-6 py-1">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-4 pr-4">
          Meet <span className="text-[#ea580c]">Sumora AI</span>: Your personal
          interview coach.
        </h2>
        <p className="text-gray-600 dark:text-[#a8a19b] text-lg mb-6 leading-relaxed">
          Sumora isn't just any AI. It's AI that knows your career goals inside
          and out. It adapts to your job title, generates targeted questions,
          scores your answers, and helps you land the role.
        </p>
        <a
          href="#"
          className="inline-flex items-center text-[#ea580c] font-medium hover:text-[#c2410c] transition-colors gap-2"
        >
          Learn more about Sumora AI <ArrowRight size={16} />
        </a>
      </div>

      {/* Feature 2 - Inactive */}
      <div className="border-l-2 border-transparent pl-6 py-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          Personalized questions for any role.
        </h2>
      </div>

      {/* Feature 3 - Inactive */}
      <div className="border-l-2 border-transparent pl-6 py-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          AI-generated resume tailored to the job.
        </h2>
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
        className="absolute inset-y-0 left-0 right-[-55%] rounded-l-[24px] rounded-r-none border border-r-0 border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-0 shadow-2xl overflow-hidden backdrop-blur-sm"
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 90%)",
        }}
      />
    </div>
  </section>
);

export default FeatureSection;
