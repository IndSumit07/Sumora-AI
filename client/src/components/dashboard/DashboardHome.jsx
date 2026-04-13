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

const FeatureCard = ({
  to,
  icon: Icon,
  title,
  description,
  tag,
  color,
  tokenCost,
}) => (
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
    {/* Token cost */}
    <div className="flex items-center justify-between mt-auto pt-1">
      <div
        className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg"
        style={{ color, backgroundColor: `${color}14` }}
      >
        <Zap size={10} className="fill-current" />
        {tokenCost !== null && tokenCost !== undefined
          ? `${tokenCost} tokens`
          : "Free"}
      </div>
      <span className="flex items-center gap-1 text-sm font-medium text-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity">
        Open <ArrowRight size={14} />
      </span>
    </div>
  </Link>
);

const StepBadge = ({ n }) => (
  <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
    {n}
  </div>
);

const Surface = ({ title, subtitle, icon: Icon, children, className = "" }) => (
  <section
    className={[
      "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-[0_12px_35px_rgba(20,20,20,0.04)] dark:border-[#232323] dark:bg-[#151515]",
      className,
    ].join(" ")}
  >
    {(title || subtitle) && (
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          {title && (
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl bg-[#ea580c]/10 p-2 text-[#ea580c]">
            <Icon size={16} />
          </div>
        )}
      </div>
    )}
    {children}
  </section>
);

/* ── Main component ──────────────────────────────────── */

const DashboardHome = () => {
  const { user } = useAuth();
  const name = user?.username ? user.username.split(" ")[0] : "there";
  const tokens = user?.tokens || 0;

  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] px-3 py-3 dark:bg-[#0f0f0f] md:px-5 md:py-5">
      <div className="mx-auto max-w-7xl space-y-5">
        <Surface className="relative overflow-hidden bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white dark:border-[#ea580c]/20 dark:bg-gradient-to-br">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
                {greeting()}, {name}
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                Your Sumora Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm text-orange-100">
                Stay on top of your interview journey with your current
                workflows, token balance, and improvement steps.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-black/10 p-3 backdrop-blur-sm md:min-w-[280px]">
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[11px] text-orange-100">Available tokens</p>
                <p className="mt-1 text-xl font-bold">{tokens}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[11px] text-orange-100">Services</p>
                <p className="mt-1 text-xl font-bold">4</p>
              </div>
              <Link
                to="/dashboard/interview"
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#ea580c] transition-colors hover:bg-orange-50"
              >
                <Mic size={15} /> Start Mock Interview
              </Link>
            </div>
          </div>
        </Surface>

        <div className="grid gap-5 xl:grid-cols-[1.75fr_1fr]">
          <Surface
            title="Explore Services"
            subtitle="Token-based pricing, same tools you already use"
            icon={TrendingUp}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                to="/dashboard/interview"
                icon={Mic}
                color="#ea580c"
                title="AI Mock Interview"
                tag="Popular"
                tokenCost={20}
                description="Live voice interview with company-specific style and full performance report."
              />
              <FeatureCard
                to="/dashboard/prepare"
                icon={BookOpen}
                color="#7c3aed"
                title="Interview Prep"
                tokenCost={20}
                description="Targeted Q&A practice and role-specific preparation workflows."
              />
              <FeatureCard
                to="/dashboard/analyze"
                icon={BarChart2}
                color="#0ea5e9"
                title="Resume Analysis"
                tokenCost={25}
                description="ATS scoring and section-based resume feedback against job requirements."
              />
              <FeatureCard
                to="/dashboard/stats"
                icon={TrendingUp}
                color="#10b981"
                title="Performance Stats"
                tokenCost={null}
                description="Track trends and readiness across your interview sessions."
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-[#242424] dark:bg-[#111]">
              <Zap
                size={13}
                className="text-[#ea580c] fill-[#ea580c] flex-shrink-0"
              />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Token costs:
              </span>
              {[
                {
                  label: "Mock Interview",
                  cost: "20/session",
                  color: "#ea580c",
                },
                { label: "Prep", cost: "20/session", color: "#7c3aed" },
                { label: "Analysis", cost: "25/analysis", color: "#0ea5e9" },
                { label: "Stats", cost: "Free", color: "#10b981" },
              ].map(({ label, cost, color }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="font-medium">{label}:</span> {cost}
                </span>
              ))}
            </div>
          </Surface>

          <Surface
            title="How It Works"
            subtitle="Your existing 3-step flow"
            icon={Users}
          >
            <ol className="space-y-4">
              {[
                {
                  n: 1,
                  title: "Set up your profile",
                  desc: "Add your resume and target role to personalize sessions.",
                },
                {
                  n: 2,
                  title: "Practice with AI",
                  desc: "Take adaptive voice or text interview sessions.",
                },
                {
                  n: 3,
                  title: "Review and improve",
                  desc: "Use feedback and scoring to focus your next steps.",
                },
              ].map(({ n, title, desc }) => (
                <li key={n} className="flex items-start gap-3">
                  <StepBadge n={n} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-[#242424] dark:bg-[#111]">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#ea580c]" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Why Sumora AI?
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  "Industry-specific questions tailored to your role",
                  "Gemini-powered deep resume analysis",
                  "Structured score and feedback after each session",
                  "Privacy-first user experience",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className="mt-0.5 flex-shrink-0 text-[#ea580c]"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Surface
            title="Our Mission"
            subtitle="What already powers your product"
            icon={Target}
          >
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Sumora AI was built to democratise interview prep. Every candidate
              should have access to practical coaching and clear feedback.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              We combine modern AI systems with focused UX so preparation feels
              guided, measurable, and easy to continue daily.
            </p>
          </Surface>

          <Surface
            title="Meet the Builder"
            subtitle="Current founder section"
            icon={Award}
          >
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-center text-xl font-bold leading-[56px] text-white">
                S
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Sumit Kumar
                </p>
                <p className="mt-0.5 text-xs font-medium text-[#ea580c]">
                  Founder
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Full-stack engineer and AI enthusiast focused on helping
                  job-seekers and developers improve faster with practical AI
                  tools.
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <a
                    href="https://github.com/IndSumit07"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#ea580c]/10 hover:text-[#ea580c]"
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sumit-kumar-545737378/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#ea580c]/10 hover:text-[#ea580c]"
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
          </Surface>
        </div>

        <Surface className="border-[#ea580c]/20 bg-[#ea580c]/5 dark:bg-[#ea580c]/10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ready to level up?
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Start your next interview or run a resume analysis now.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard/interview"
                className="flex items-center gap-2 rounded-xl bg-[#ea580c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d24e0b]"
              >
                <Mic size={15} /> Mock Interview
              </Link>
              <Link
                to="/dashboard/analyze"
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#ea580c]/50 hover:text-[#ea580c] dark:border-[#333] dark:text-gray-300"
              >
                <BarChart2 size={15} /> Analyze Resume
              </Link>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
};

export default DashboardHome;
