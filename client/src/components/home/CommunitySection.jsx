import { DiscordIcon } from "./SocialIcons";

const TestimonialCard = ({ avatar, handle, text, bgIcon }) => (
  <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-3 text-left break-inside-avoid hover:border-gray-300 dark:hover:border-white/10 transition-colors">
    <p className="text-gray-600 dark:text-gray-400 text-[14px] leading-relaxed">
      {text}
    </p>
    <div className="flex items-center gap-3 mt-auto pt-1">
      <div
        className={`w-7 h-7 rounded-full ${bgIcon} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
      >
        {avatar}
      </div>
      <p className="text-gray-900 dark:text-white text-sm font-medium">
        {handle}
      </p>
    </div>
  </div>
);

const CommunitySection = () => {
  const col1 = [
    {
      avatar: "AL",
      handle: "@adm_lawson",
      bgIcon: "bg-[#e3428d]",
      text: "Sumora AI generated exactly the kind of questions I got in my Google interview. Absolutely game-changing.",
    },
    {
      avatar: "PA",
      handle: "@pontusab",
      bgIcon: "bg-[#2D8CFF]",
      text: "Landed my dream job at a FAANG after just 2 weeks of practice. Sumora's scoring was incredibly accurate.",
    },
    {
      avatar: "NB",
      handle: "@nerdburn",
      bgIcon: "bg-[#5235e5]",
      text: "The behavioral question AI is spot on. It knows exactly what interviewers are looking for and coaches you to answer better.",
    },
    {
      avatar: "AL",
      handle: "@adm_l",
      bgIcon: "bg-[#e3428d]",
      text: "My confidence went from 3/10 to 9/10 after using Sumora for just one week.",
    },
  ];

  const col2 = [
    {
      avatar: "MG",
      handle: "@xthemadgeniusx",
      bgIcon: "bg-[#24a148]",
      text: "I uploaded my resume and within seconds had 20 tailored questions for a senior PM role. Incredibly impressive.",
    },
    {
      avatar: "DD",
      handle: "@dadoos_",
      bgIcon: "bg-[#5235e5]",
      text: "The AI scored my answers in real-time. It felt like practicing with an actual interviewer.",
    },
    {
      avatar: "OP",
      handle: "@orlandopedro_",
      bgIcon: "bg-[#000]",
      text: "The resume builder suggestions were so much better than anything I had tried before.",
    },
  ];

  const col3 = [
    {
      avatar: "GI",
      handle: "@gokul_i",
      bgIcon: "bg-[#e3a842]",
      text: "Used Sumora for 3 weeks before my FAANG loop. Made it to final rounds for the first time ever.",
    },
    {
      avatar: "SD",
      handle: "@sdusteric",
      bgIcon: "bg-[#5235e5]",
      text: "Love how it generates both technical and behavioral questions based on the job description. Saves so much prep time.",
    },
    {
      avatar: "TB",
      handle: "@TyranBache",
      bgIcon: "bg-[#8242e3]",
      text: "Can't imagine preparing for interviews any other way.",
    },
  ];

  const col4 = [
    {
      avatar: "PC",
      handle: "@patrickc",
      bgIcon: "bg-[#e3a842]",
      text: "Very impressed by @sumora's interview prep quality. For job seekers, it's gone from 'promising' to 'essential' in remarkably short order.",
    },
    {
      avatar: "VM",
      handle: "@viratt_mank",
      bgIcon: "bg-[#8242e3]",
      text: "Truly a game changer for career advancement.",
    },
    {
      avatar: "AL",
      handle: "@adm_lawson",
      bgIcon: "bg-[#e3428d]",
      text: "Sumora generated the exact behavioral questions from my Amazon loop. Passed all rounds on my first attempt.",
    },
  ];

  return (
    <section className="py-32 px-4 max-w-[1200px] mx-auto text-center relative z-10 w-full mb-10 text-gray-900 dark:text-white">
      <h2 className="text-[2.5rem] sm:text-[3.5rem] font-semibold text-gray-900 dark:text-white tracking-tight mb-4 inline-block w-full">
        Join the community
      </h2>
      <p className="text-gray-600 dark:text-[#a8a19b] text-lg mb-10 w-full block">
        See how candidates are landing their dream jobs with Sumora AI.
      </p>
      <div className="flex justify-center mb-16">
        <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#1c1c1c] hover:bg-gray-200 dark:hover:bg-[#252528] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white px-5 py-2 rounded-xl font-medium transition-colors text-[15px]">
          <DiscordIcon /> Join us on Discord
        </button>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 50%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 90%)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-4">
            {col1.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {col2.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          <div className="flex flex-col gap-4 hidden sm:flex">
            {col3.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          <div className="flex flex-col gap-4 hidden lg:flex">
            {col4.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
