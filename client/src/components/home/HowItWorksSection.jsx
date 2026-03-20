import { UploadCloud, MessageSquare, BarChart } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: UploadCloud,
      title: "1. Setup & Context",
      desc: "Provide your resume or LinkedIn profile, along with the job description you're targeting. Sumora instantly analyzes the core requirements.",
      color: "text-[#ea580c]",
      bg: "bg-[#ea580c]/10",
      border: "border-[#ea580c]/20",
    },
    {
      icon: MessageSquare,
      title: "2. The AI Interview",
      desc: "Jump into an interactive voice or text session. Sumora's AI acts as the hiring manager, seamlessly adapting questions based on your background.",
      color: "text-[#0ea5e9]",
      bg: "bg-[#0ea5e9]/10",
      border: "border-[#0ea5e9]/20",
    },
    {
      icon: BarChart,
      title: "3. Feedback & Scoring",
      desc: "Receive deep performance metrics. Find out exactly where you excelled, which topics need work, and how a real recruiter would view your answers.",
      color: "text-[#7c3aed]",
      bg: "bg-[#7c3aed]/10",
      border: "border-[#7c3aed]/20",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          How Sumora Works
        </h2>
        <p className="text-gray-600 dark:text-[#a8a19b] max-w-2xl mx-auto text-lg leading-relaxed">
          Three simple steps to landing your dream job. Say goodbye to general
          advice and hello to personalized, actionable prep.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#ea580c]/20 via-[#0ea5e9]/20 to-[#7c3aed]/20 z-0"></div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl border border-gray-100 dark:border-[#2a2a2a] bg-white/60 dark:bg-[#161616]/60 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-2"
          >
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border ${step.border} ${step.bg} ${step.color}`}
            >
              <step.icon size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {step.title}
            </h3>
            <p className="text-[15px] text-gray-600 dark:text-[#a8a19b] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
