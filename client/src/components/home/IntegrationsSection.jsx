import {
  DiscordIcon,
  SlackIcon,
  TelegramIcon,
  WhatsAppIcon,
  ZoomIcon,
} from "./SocialIcons";

const IntegrationsSection = () => {
  const tools = [
    {
      name: "LinkedIn",
      icon: <WhatsAppIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    {
      name: "HackerRank",
      icon: <DiscordIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    {
      name: "LeetCode",
      icon: <TelegramIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    {
      name: "Glassdoor",
      icon: <SlackIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    { name: "Indeed", icon: <ZoomIcon />, bg: "bg-[#2D8CFF]" },
  ];
  const duplicatedTools = [...tools, ...tools, ...tools, ...tools];

  return (
    <section className="py-24 overflow-hidden bg-transparent">
      <p className="text-center text-[11px] font-bold tracking-[0.2em] text-gray-600 dark:text-[#a8a19b] mb-12 uppercase">
        WORKS WITH YOUR FAVORITE CAREER PLATFORMS
      </p>

      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#110d0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#110d0a] to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-4 px-4 animate-marquee">
          {duplicatedTools.map((tool, i) => (
            <div
              key={i}
              className={`${tool.bg === "bg-[#2D8CFF]" ? "bg-[#2D8CFF] text-gray-900 dark:text-white" : "bg-gray-100 dark:bg-[#18181A] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#202022]"} flex items-center gap-3 px-6 py-3.5 rounded-full border ${tool.bg === "bg-[#2D8CFF]" ? "border-[#2D8CFF]" : "border-black/10 dark:border-white/10"} transition-colors whitespace-nowrap shrink-0`}
            >
              {tool.icon}
              <span className="font-medium text-[15px]">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
