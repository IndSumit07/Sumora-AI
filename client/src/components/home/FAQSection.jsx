import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How does the AI know what questions to ask?",
      a: "Sumora parses the job description and your resume context, acting exactly like a specialized technical recruiter for that role.",
    },
    {
      q: "Can I practice for non-technical roles?",
      a: "Absolutely! While we excel at technical screens, Sumora is adaptable and will pivot to behavioral or general business questions if you provide a non-technical job description.",
    },
    {
      q: "What makes the Pro tier better?",
      a: "The Pro tier unlocks our advanced voice-to-voice interview model, unlimited daily limits, and gives you richer per-question feedback breakdowns rather than only high-level summaries.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. Your session transcripts and uploaded resumes are private and securely stored. We never sell your personal data.",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto z-10 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-[#a8a19b] max-w-2xl mx-auto text-lg leading-relaxed">
          Everything you need to know about the product and billing.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-[#2a2a2a] bg-white/40 dark:bg-[#161616]/40 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-[#1f1f1f]/80"
            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
          >
            <div className="px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {faq.q}
              </h3>
              {openIdx === idx ? (
                <ChevronUp className="text-[#ea580c]" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </div>
            {openIdx === idx && (
              <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-[#a8a19b] leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
