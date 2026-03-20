import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LiquidMetalButton } from "../ui/liquid-metal-button";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10 relative">
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#ea580c]/10 via-[#ea580c]/5 to-transparent border border-[#ea580c]/20 p-10 sm:p-16 md:p-20 overflow-hidden isolate text-center">
        {/* Decorative Blobs */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#ea580c] opacity-20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#0ea5e9] opacity-20 blur-[100px] rounded-full" />

        <h2 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="relative z-10 text-lg sm:text-xl text-gray-600 dark:text-[#a8a19b] max-w-2xl mx-auto mb-10">
          Join thousands of job seekers who leveled up their career with
          Sumora's AI-powered targeted mock interviews. Get started in minutes.
        </p>

        <div className="relative z-10 flex justify-center">
          <LiquidMetalButton
            label="Start for Free"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </section>
  );
}
