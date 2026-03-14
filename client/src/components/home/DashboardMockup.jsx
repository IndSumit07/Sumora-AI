import {
  MessageSquare,
  Users,
  Phone,
  FileIcon,
  Settings,
  Search,
  Bell,
  Plus,
  Video,
  MoreHorizontal,
  Hash,
  Paperclip,
  Smile,
} from "lucide-react";

const defaultClass = "w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40";
const defaultStyle = {
  maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
};

const DashboardMockup = ({ className, style } = {}) => (
  <div
    className={className ?? defaultClass}
    style={style ?? defaultStyle}
  >
    <div className="rounded-[18px] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#121110] flex h-[750px] overflow-hidden">
      {/* 1st Sidebar (Apps/Icons) */}
      <div className="w-[70px] border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-5 gap-6 shrink-0 bg-[#f3f4f6]/50 dark:bg-[#0d0a08]/50">
        <div className="w-10 h-10 rounded-xl bg-[#5235e5] text-gray-900 dark:text-white flex items-center justify-center font-bold text-lg mb-4">
          S
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-[#5235e5]">
          <div className="w-12 h-10 rounded-xl bg-[#5235e5]/10 flex items-center justify-center">
            <MessageSquare size={20} fill="#5235e5" />
          </div>
          <span className="text-[10px] font-medium font-sans">Practice</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Users size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Sessions</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Phone size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Mock AI</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <FileIcon size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Resume</span>
        </div>
        <div className="mt-auto flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Settings</span>
        </div>
      </div>

      {/* 2nd Sidebar (Sessions/Reports) */}
      <div className="w-[280px] border-r border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#121110] shrink-0">
        <div className="px-5 py-6 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white font-semibold text-xl">
            Sessions
          </h2>
          <Plus size={18} className="text-[#5235e5] cursor-pointer" />
        </div>
        <div className="px-5 mb-6">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-full py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-[10px] font-semibold text-gray-500 mb-2 px-2 tracking-wider mt-2">
            MY SESSIONS
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#282142] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#5235e5] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                GN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    # frontend-eng
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-[10px]">
                    5:38
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-xs truncate">
                  AI: Great answer!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/5 dark:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#e3428d] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                DT
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    # product-mgr
                  </span>
                  <span className="text-gray-500 text-[10px]">4:12</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    Score: 78%
                  </p>
                  <div className="w-4 h-4 rounded-full bg-[#5235e5] flex items-center justify-center text-[9px] text-gray-900 dark:text-white font-bold ml-2">
                    3
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/5 dark:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#24a148] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                DV
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    # data-science
                  </span>
                  <span className="text-gray-500 text-[10px]">3:00</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  Score: 82%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/5 dark:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#e3a842] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                AN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    # backend-dev
                  </span>
                  <span className="text-gray-500 text-[10px]">Mon</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  Not started yet
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-semibold text-gray-500 mb-2 px-2 tracking-wider mt-6">
            RECENT REPORTS
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/5 dark:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0 relative">
                TK
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#24a148] border-2 border-[#121110] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    Frontend Report
                  </span>
                  <span className="text-gray-500 text-[10px]">2:58</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    Overall score: 74%
                  </p>
                  <div className="w-4 h-4 rounded-full bg-[#5235e5] flex items-center justify-center text-[9px] text-gray-900 dark:text-white font-bold ml-2">
                    1
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-black/5 dark:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#e35642] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                CD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    Product Manager
                  </span>
                  <span className="text-gray-500 text-[10px]">Tue</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  Completed 3 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#121110] relative">
        {/* Top bar */}
        <div className="absolute top-0 right-0 left-0 h-16 border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between bg-white dark:bg-[#121110] z-10">
          <div className="flex-1 max-w-md bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl flex items-center px-4 h-10 ml-6">
            <Search size={14} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search sessions, questions..."
              className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-full placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Bell
              size={18}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white cursor-pointer"
            />
            <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white cursor-pointer">
              <Plus size={16} />
            </div>
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-full pl-1.5 pr-3 py-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#5235e5] text-gray-900 dark:text-white flex items-center justify-center text-xs font-bold relative">
                AC
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#24a148] border-2 border-[#1a1a1a] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-white text-sm leading-tight">
                  Alfredo C.
                </span>
                <span className="text-[#24a148] text-[10px] leading-tight font-medium">
                  Online
                </span>
                <MoreHorizontal
                  size={10}
                  className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Session Header */}
        <div className="h-16 mt-16 px-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-1">
              # frontend-eng
            </h2>
            <div className="flex -space-x-1.5 ml-2">
              <div className="w-5 h-5 rounded-full bg-[#5235e5] border border-[#121110]"></div>
              <div className="w-5 h-5 rounded-full bg-[#e3428d] border border-[#121110]"></div>
              <div className="w-5 h-5 rounded-full bg-[#e3a842] border border-[#121110]"></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              9 Members ·{" "}
              <span className="text-[#24a148] font-medium">3 Answered</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <Search size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <Video size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Interview Q&A Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-sm font-bold shrink-0">
              TK
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  AI Interviewer
                </span>
                <span className="text-gray-500 text-xs">5:30 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Tell me about a time you had to optimize a slow query in
                production. What was your approach and what was the outcome?
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e35642] flex items-center justify-center text-gray-900 dark:text-white text-sm font-bold shrink-0">
              CD
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  You
                </span>
                <span className="text-gray-500 text-xs">5:32 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                I identified a missing index on the users table causing a full
                scan. Added a composite index which reduced query time from 4s
                to 0.3s.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
            <span className="text-xs text-gray-600 font-medium">Today</span>
            <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#24a148] flex items-center justify-center text-gray-900 dark:text-white text-sm font-bold shrink-0">
              TR
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  AI Interviewer
                </span>
                <span className="text-gray-500 text-xs">5:38 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Excellent answer! You demonstrated problem identification,
                systematic approach, and measurable results. Score: 9/10
              </p>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        <div className="p-6 pt-0">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-2 flex items-end gap-3 hover:border-white/20 transition-colors">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type your answer here..."
                className="w-full bg-transparent border-none text-gray-900 dark:text-white text-sm focus:outline-none px-3 py-2 pb-2 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2 pb-1 pr-1">
              <button className="text-gray-500 hover:text-gray-900 dark:text-white p-1">
                <Smile size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-900 dark:text-white p-1">
                <Paperclip size={18} />
              </button>
              <button className="bg-[#5235e5] hover:bg-[#6042ef] text-gray-900 dark:text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3rd Sidebar (Session Details) */}
      <div className="w-[280px] border-l border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#121110] shrink-0 hidden lg:flex mt-16">
        <div className="px-5 py-6 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-6">
            Session Details
          </h3>

          <p className="text-[10px] font-semibold text-gray-500 tracking-wider mb-2">
            JOB ROLE
          </p>
          <div className="text-gray-900 dark:text-white text-sm font-medium flex items-center gap-1.5 mb-6">
            <Hash size={14} className="text-gray-600 dark:text-gray-400" />{" "}
            Frontend Engineer
          </div>

          <p className="text-[10px] font-semibold text-gray-500 tracking-wider mb-2">
            JOB DESCRIPTION
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
            You're preparing for a Frontend Engineer role. Answer AI-generated
            questions and get scored instantly.
          </p>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider">
              PARTICIPANTS
            </p>
            <Plus
              size={14}
              className="text-[#5235e5] cursor-pointer hover:text-[#6042ef]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5235e5] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0 relative">
                AL
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#24a148] border-2 border-[#121110] rounded-full"></div>
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  AI Coach
                </span>
                <span className="text-[#24a148] text-[10px] font-medium mt-0.5 block">
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e3428d] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0 relative">
                AP
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#24a148] border-2 border-[#121110] rounded-full"></div>
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  Sarah K.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0">
                TK
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  Mock Coach
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e35642] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0">
                CD
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  Alex M.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMockup;
