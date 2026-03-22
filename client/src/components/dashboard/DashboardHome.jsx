import { Link } from "react-router-dom";
import { LiquidMetalButton } from "../ui/liquid-metal-button";
import { useAuth } from "../../context/AuthContext";
import {
  Mic,
  BarChart2,
  BookOpen,
  Zap,
  Target,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  Award,
  Github,
  Linkedin,
  Check,
} from "lucide-react";

/* ── Helpers ─────────────────────────────────────────── */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ── Sub-components ──────────────────────────────────── */

const FeatureCard = ({ to, icon: Icon, title, description, tag, color }) => (
  <Link
    to={to}
    className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222] hover:border-[#ea580c]/40 transition-all hover:shadow-lg hover:shadow-[#ea580c]/5"
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}18` }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    {tag && (
      <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#ea580c]/10 text-[#ea580c]">
        {tag}
      </span>
    )}
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
    <span className="flex items-center gap-1 text-sm font-medium text-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity">
      Get started <ArrowRight size={14} />
    </span>
  </Link>
);

const StepBadge = ({ n }) => (
  <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
    {n}
  </div>
);

/* ── Main component ──────────────────────────────────── */

const DashboardHome = () => {
  const { user } = useAuth();
  const name = user?.username ? user.username.split(" ")[0] : "there";

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* ── Hero ───────────────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] p-8 md:p-12 text-white">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-orange-200 text-sm font-medium mb-2 uppercase tracking-widest">
                  {greeting()}, {name} 👋
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Welcome to Sumora&nbsp;AI
                </h1>
                <p className="text-orange-100 text-sm md:text-base max-w-md leading-relaxed">
                  Your AI-powered career co-pilot. Practice interviews, analyze
                  your profile, and prepare smarter — all in one place.
                </p>
              </div>
              <Link
                to="/dashboard/interview"
                className="flex-shrink-0 flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-xl bg-white text-[#ea580c] font-semibold text-sm hover:bg-orange-50 transition-colors shadow-lg"
              >
                <Zap size={16} /> Start Interview
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Explore Features
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Everything you need to land your next role
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              to="/dashboard/interview"
              icon={Mic}
              color="#ea580c"
              title="AI Mock Interview"
              tag="Popular"
              description="Live, role-aware interview simulations powered by LLaMA 3.1. Get real-time follow-ups and detailed feedback at the end."
            />
            <FeatureCard
              to="/dashboard/analyze"
              icon={BarChart2}
              color="#0ea5e9"
              title="Resume Analyzer"
              description="Upload your resume & job description. Get a match score, gap analysis, ATS tips, and an AI-generated tailored resume."
            />
            <FeatureCard
              to="/dashboard/prepare"
              icon={BookOpen}
              color="#7c3aed"
              title="Topic Preparation"
              description="Deep-dive into any subject. Our AI quizzes you interactively on your chosen topics and scores your understanding."
            />
          </div>
        </section>

        {/* ── How it works ───────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              How It Works
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Three simple steps to career-readiness
            </p>
            <ol className="space-y-5">
              {[
                {
                  n: 1,
                  title: "Set up your profile",
                  desc: "Paste a job description or pick a subject. Upload your resume for personalised questions.",
                },
                {
                  n: 2,
                  title: "Practice with AI",
                  desc: "Chat back and forth with our LLM. It adapts followups based on your answers in real time.",
                },
                {
                  n: 3,
                  title: "Review & improve",
                  desc: "Get a scored feedback report with specific strengths, weaknesses, and actionable next steps.",
                },
              ].map(({ n, title, desc }) => (
                <li key={n} className="flex gap-4 items-start">
                  <StepBadge n={n} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Why Sumora */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#ea580c]" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Why Sumora AI?
              </h3>
            </div>
            {[
              "Industry-specific questions tailored to your role",
              "LLaMA 3.1 backbone for natural, context-aware dialogue",
              "Gemini 2.5 Flash powers deep resume analysis",
              "Scores & structured feedback after every session",
              "Privacy-first — your data stays yours",
              "Free to start, no credit card required",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check
                  size={15}
                  className="text-[#ea580c] flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── About / CTO ────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222]">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} className="text-[#ea580c]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Our Mission
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Sumora AI was built to democratise interview prep. We believe
              every candidate, regardless of background or budget, deserves
              access to expert-level coaching and honest feedback.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We combine the latest open-weight models with thoughtful UX to
              create an experience that's both powerful and approachable.
            </p>
          </div>

          {/* CTO Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222]">
            <div className="flex items-center gap-2 mb-5">
              <Award size={18} className="text-[#ea580c]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Meet the Builder
              </h3>
            </div>
            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Sumit Kumar
                </p>
                <p className="text-xs text-[#ea580c] font-medium mt-0.5">
                  Founder
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Full-stack engineer & AI enthusiast. Building tools that help
                  developers and job-seekers grow faster using cutting-edge
                  LLMs.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="https://github.com/IndSumit07"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sumit-kumar-545737378/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
                  >
                    <Linkedin size={15} />
                  </a>

                  <div className="ml-auto">
                    <LiquidMetalButton
                      label="Follow Me"
                      onClick={() =>
                        window.open("https://github.com/IndSumit07", "_blank")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────── */}
        <section>
          <div className="rounded-3xl border border-[#ea580c]/20 bg-[#ea580c]/5 dark:bg-[#ea580c]/8 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Ready to level up?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start your first AI mock interview now — no setup needed.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/dashboard/interview"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] text-white text-sm font-medium hover:bg-[#d24e0b] transition-colors"
              >
                <Mic size={15} /> Mock Interview
              </Link>
              <Link
                to="/dashboard/analyze"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-[#ea580c]/50 hover:text-[#ea580c] transition-colors"
              >
                <BarChart2 size={15} /> Analyze Resume
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
          © {new Date().getFullYear()} Sumora AI — Built with ❤️ using React,
          LangChain &amp; Groq
        </footer>
      </div>
    </div>
  );
};

export default DashboardHome;
