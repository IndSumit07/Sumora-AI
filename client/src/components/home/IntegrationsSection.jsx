const IntegrationsSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-4xl mx-auto text-center">
      {/* decorative line */}
      <div className="flex items-center justify-center gap-4 mb-14">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#ea580c]/60" />
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ea580c]">
          The Sumora Belief
        </span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#ea580c]/60" />
      </div>

      {/* opening quote mark */}

      {/* quote body */}
      <blockquote>
        <p className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-[#ebe4de] leading-tight tracking-tight">
          <span className="text-[#ea580c] font-serif text-5xl md:text-7xl leading-none relative top-3 md:top-5 select-none opacity-80">&ldquo;</span>{" "}Talent gets you in the room.{" "}
          <span className="text-[#ea580c]">Preparation</span> gets you the job.
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

export default IntegrationsSection;
