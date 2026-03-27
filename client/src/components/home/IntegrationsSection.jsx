import { COMPANY_INTERVIEW_PROFILES } from "../../shared/companyInterviewProfiles";

const IntegrationsSection = () => {
  const companies = COMPANY_INTERVIEW_PROFILES.filter((c) => !!c.logoUrl);

  return (
    <section className="py-24 px-6 overflow-hidden">
      {/* Companies Marquee */}
      <div className="max-w-[1200px] mx-auto mb-24">
        <p className="text-center text-sm font-semibold tracking-widest uppercase text-gray-400 dark:text-[#a8a19b] mb-8">
          Mock Interviews Available For
        </p>
        <div className="relative flex overflow-hidden">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-gray-50 dark:from-[#0d0d0d] to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-gray-50 dark:from-[#0d0d0d] to-transparent z-10"></div>

          <div className="flex animate-marquee gap-8 sm:gap-14 items-center">
            {/* Double the array for seamless infinite looping */}
            {[...companies, ...companies].map((profile, i) => {
              const nameOnly = profile.name.split(" @ ")[1] || profile.name;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 opacity-75 hover:opacity-100 transition-all duration-300"
                  title={nameOnly}
                >
                  <img
                    src={profile.logoUrl}
                    alt={nameOnly}
                    className="h-10 sm:h-12 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {nameOnly}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* decorative line */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#ea580c]/60" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ea580c]">
            The Sumora Belief
          </span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#ea580c]/60" />
        </div>

        {/* quote body */}
        <blockquote>
          <p className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-[#ebe4de] leading-tight tracking-tight">
            <span className="text-[#ea580c] font-serif text-5xl md:text-7xl leading-none relative top-3 md:top-5 select-none opacity-80">
              &ldquo;
            </span>{" "}
            Talent gets you in the room.{" "}
            <span className="text-[#ea580c]">Preparation</span> gets you the
            job.
          </p>

          <p className="mt-6 text-lg md:text-2xl font-light text-gray-500 dark:text-[#a8a19b] leading-relaxed max-w-2xl mx-auto">
            Every top performer you admire didn't wing it. They rehearsed,
            refined, and showed up ready. Now it's your turn.
          </p>

          {/* attribution */}
          <footer className="mt-10 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#ea580c]/50" />
            <cite className="not-italic text-sm font-semibold tracking-widest uppercase text-gray-400 dark:text-[#6b6360]">
              Sumora AI
            </cite>
            <span className="h-px w-8 bg-[#ea580c]/50" />
          </footer>
        </blockquote>
      </div>
    </section>
  );
};

export default IntegrationsSection;
