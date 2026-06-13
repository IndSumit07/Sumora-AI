import { UploadCloud, MessageSquare, BarChart } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UploadCloud,
    title: "Upload",
    headline: "Drop your resume. Paste the JD.",
    desc: "Sumora's AI maps your experience against the job description in seconds — finding the gaps most candidates miss.",
  },
  {
    num: "02",
    icon: MessageSquare,
    title: "Interview",
    headline: "Face a live AI interviewer.",
    desc: "A real-time voice conversation that adapts to your background, probes your weak spots, and mirrors how actual companies interview.",
  },
  {
    num: "03",
    icon: BarChart,
    title: "Improve",
    headline: "Know exactly where you stand.",
    desc: "Question-by-question scoring, communication ratings, and a prep plan built around your real deficiencies — not generic advice.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10 relative">
      {/* ── Heading ── */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#ea580c]/40" />
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ea580c]">
            The Process
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#ea580c]/40" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          How Sumora works
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          From upload to offer — three steps, zero guesswork.
        </p>
      </div>

      {/* ── Steps Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.num}
            className="group relative rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-gray-300 dark:hover:border-[#333] overflow-hidden"
          >
            {/* Decorative blob on hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ea580c] opacity-0 blur-[80px] rounded-full transition-opacity duration-500 group-hover:opacity-[0.06] pointer-events-none" />

            {/* Top section — big number + icon */}
            <div className="relative px-8 pt-10 pb-6">
              {/* Huge number */}
              <span className="block text-[8rem] sm:text-[9rem] font-black text-gray-100 dark:text-white/[0.04] leading-[0.8] select-none transition-colors duration-500 group-hover:text-[#ea580c]/[0.1] dark:group-hover:text-[#ea580c]/[0.08]">
                {step.num}
              </span>

              {/* Icon — positioned bottom-right of the number */}
              <div className="absolute bottom-4 right-8 w-12 h-12 rounded-xl bg-[#ea580c]/10 flex items-center justify-center text-[#ea580c] transition-all duration-300 group-hover:bg-[#ea580c] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#ea580c]/20">
                <step.icon size={22} strokeWidth={1.5} />
              </div>
            </div>

            {/* Divider */}
            <div className="mx-8 h-px bg-gray-100 dark:bg-[#222]" />

            {/* Content */}
            <div className="px-8 py-8">
              {/* Label */}
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#ea580c] mb-2">
                {step.title}
              </p>

              {/* Headline */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
                {step.headline}
              </h3>

              {/* Description */}
              <p className="text-[15px] text-gray-500 dark:text-[#7a7570] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
