const BackgroundGradient = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-white dark:bg-[#0e0a09]"></div>

    {/* Light Beam Effect (Orange Theme) */}
    <div
      className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[200%] h-[100%] z-0 mix-blend-multiply dark:mix-blend-screen animate-beam"
      style={{
        background:
          "conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(234, 88, 12, 0.15) 45%, rgba(249, 115, 22, 0.3) 50%, rgba(234, 88, 12, 0.15) 55%, transparent 60%)",
        filter: "blur(40px)",
      }}
    ></div>

    {/* Deep light core (Orange Theme) */}
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ea580c] via-[#c2410c]/40 to-transparent opacity-60 blur-[60px] animate-pulse-slow"></div>

    {/* Grid pattern overlay */}
    <div className="absolute inset-0 dark:opacity-100 opacity-50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-20"></div>
  </div>
);

export default BackgroundGradient;
