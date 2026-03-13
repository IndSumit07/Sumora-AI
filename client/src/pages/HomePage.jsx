import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../components/UserDropdown";
import AccountModal from "../components/AccountModal";
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
  Sun,
  Moon,
  Hash,
  Paperclip,
  Smile,
  Send,
  Github,
  Twitter,
  ArrowRight,
} from "lucide-react";

// Social / Brand Icons mock
const DiscordIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#5865F2]"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.6177-1.2498a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const SlackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#E01E5A]"
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const TelegramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#26A5E4]"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#25D366]"
  >
    <path d="M11.964 0h-.024C5.352 0 0 5.353 0 11.94c0 2.112.553 4.146 1.583 5.945L.16 23.36l5.723-1.5c1.748.96 3.738 1.47 5.807 1.47h.024c6.586 0 11.94-5.354 11.94-11.943C23.654 5.353 18.3 0 11.964 0zM12 21.36h-.021c-1.785 0-3.53-.478-5.06-1.385l-.363-.214-3.766.988.997-3.666-.235-.374A9.822 9.822 0 0 1 2.05 11.942c0-5.419 4.417-9.842 9.843-9.842 5.424 0 9.841 4.423 9.841 9.842 0 5.42-4.417 9.84-9.841 9.84zM17.41 14.1l-2.45-1.21c-.26-.13-.53-.18-.8-.01l-1.12 1.37c-.18.22-.44.27-.69.17-1.57-.61-2.92-1.72-3.86-3.15-.15-.23-.13-.52.06-.71l.98-1.02c.16-.16.22-.41.13-.63l-.9-2.31c-.13-.34-.49-.55-.86-.5l-.89.1c-.61.08-1.14.49-1.39 1.06-.63 1.45-.19 3.48 1.34 5.31 1.63 1.95 3.79 3.23 5.92 3.23.18 0 .36-.02.54-.05.59-.11 1.08-.55 1.25-1.13l.26-.95c.1-.38-.07-.78-.43-.94z" />
  </svg>
);

const ZoomIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#2D8CFF]"
  >
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.176 15.65v-3.73l2.842 2.214V9.866L17.176 12.08V8.35C17.176 7.6 16.574 7 15.824 7H5.353C4.603 7 4 7.6 4 8.35v7.298C4 16.4 4.603 17 5.353 17h10.47c.75 0 1.353-.6 1.353-1.35zM6.55 9H14.8c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5H6.55c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5z" />
  </svg>
);

const DashboardMockup = () => (
  <div
    className="w-full max-w-[1200px] mx-auto rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm -mt-4 lg:-mt-10 max-h-[1000px] z-10 -mb-24 md:-mb-40"
    style={{
      maskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 85%)",
    }}
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
          <span className="text-[10px] font-medium font-sans">Chats</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Users size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Groups</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Phone size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Calls</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <FileIcon size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Files</span>
        </div>
        <div className="mt-auto flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <div className="w-12 h-10 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <span className="text-[10px] font-medium font-sans">Settings</span>
        </div>
      </div>

      {/* 2nd Sidebar (Channels/DMs) */}
      <div className="w-[280px] border-r border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#121110] shrink-0">
        <div className="px-5 py-6 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white font-semibold text-xl">
            Messages
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
            CHANNELS
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[#282142] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#5235e5] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                GN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    # general
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-[10px]">
                    5:38
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-xs truncate">
                  Talan: all smooth
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
                    # design-team
                  </span>
                  <span className="text-gray-500 text-[10px]">4:12</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    New mockups uploaded
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
                    # dev-updates
                  </span>
                  <span className="text-gray-500 text-[10px]">3:00</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  PR #42 is ready
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
                    # announcements
                  </span>
                  <span className="text-gray-500 text-[10px]">Mon</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  Team offsite Friday
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-semibold text-gray-500 mb-2 px-2 tracking-wider mt-6">
            DIRECT MESSAGES
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
                    Tiana Korsgaard
                  </span>
                  <span className="text-gray-500 text-[10px]">2:58</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    Thanks for the update!
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
                    Corey Dies
                  </span>
                  <span className="text-gray-500 text-[10px]">Tue</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  Seen the new figma?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#121110] relative">
        {/* Top bar search/profile (global) */}
        <div className="absolute top-0 right-0 left-0 h-16 border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between bg-white dark:bg-[#121110] z-10">
          <div className="flex-1 max-w-md bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl flex items-center px-4 h-10 ml-6">
            <Search size={14} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search messages, channels..."
              className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-full placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <div className="relative">
              <Bell
                size={18}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white cursor-pointer"
              />
            </div>
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

        {/* Chat Header */}
        <div className="h-16 mt-16 px-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-1">
              # general
            </h2>
            <div className="flex -space-x-1.5 ml-2">
              <div className="w-5 h-5 rounded-full bg-[#5235e5] border border-[#121110]"></div>
              <div className="w-5 h-5 rounded-full bg-[#e3428d] border border-[#121110]"></div>
              <div className="w-5 h-5 rounded-full bg-[#e3a842] border border-[#121110]"></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              9 Members ·{" "}
              <span className="text-[#24a148] font-medium">4 Online</span>
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

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-sm font-bold shrink-0">
              TK
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Tiana Korsgaard
                </span>
                <span className="text-gray-500 text-xs">5:30 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                It's going well. We've made some good progress on the design and
                we're starting to work on the development phase.
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
                  Corey Dies
                </span>
                <span className="text-gray-500 text-xs">5:32 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                That's great to hear. Have you run into any issues or roadblocks
                so far?
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
                  Talan Rosser
                </span>
                <span className="text-gray-500 text-xs">5:38 PM</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Not really, everything has been going smoothly. We did have to
                make some changes to the initial plan, but we were able to
                adjust quickly.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 pt-0">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-2 flex items-end gap-3 hover:border-white/20 transition-colors">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a message..."
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

      {/* 3rd Sidebar (Details) */}
      <div className="w-[280px] border-l border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#121110] shrink-0 hidden lg:flex mt-16">
        <div className="px-5 py-6 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-6">
            Detail Channels
          </h3>

          <p className="text-[10px] font-semibold text-gray-500 tracking-wider mb-2">
            NAME CHANNEL
          </p>
          <div className="text-gray-900 dark:text-white text-sm font-medium flex items-center gap-1.5 mb-6">
            <Hash size={14} className="text-gray-600 dark:text-gray-400" />{" "}
            general
          </div>

          <p className="text-[10px] font-semibold text-gray-500 tracking-wider mb-2">
            ABOUT
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
            Team chat, announcements, and collaboration hub.
          </p>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider">
              MEMBER
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
                  Alfredo Carder
                </span>
                <span className="text-[#24a148] text-[10px] font-medium mt-0.5 block">
                  Owner
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
                  Alfredo Pr.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0">
                TK
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  Tiana K.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e35642] flex items-center justify-center text-gray-900 dark:text-white text-[10px] font-bold shrink-0">
                CD
              </div>
              <div>
                <span className="text-gray-900 dark:text-white text-sm font-medium block leading-tight">
                  Corey D.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntegrationsSection = () => {
  const tools = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    {
      name: "Discord",
      icon: <DiscordIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      bg: "bg-gray-100 dark:bg-[#18181A]",
    },
    { name: "Slack", icon: <SlackIcon />, bg: "bg-gray-100 dark:bg-[#18181A]" },
    { name: "Zoom", icon: <ZoomIcon />, bg: "bg-[#2D8CFF]" },
  ];
  const duplicatedTools = [...tools, ...tools, ...tools, ...tools]; // For marquee effect

  return (
    <section className="py-24 overflow-hidden bg-transparent">
      <p className="text-center text-[11px] font-bold tracking-[0.2em] text-gray-600 dark:text-[#a8a19b] mb-12 uppercase">
        INTEGRATES WITH THE TOOLS YOUR TEAM ALREADY USES
      </p>

      <div className="relative flex whitespace-nowrap overflow-hidden">
        {/* Left/Right fading gradients */}
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

const FeatureSection = () => (
  <section className="py-20 px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
    <div className="space-y-12 shrink-0">
      {/* Feature 1 - Active */}
      <div className="border-l-2 border-[#8242e3] pl-6 py-1">
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#8242e3] mb-4 pr-4">
          Meet Sumora AI: Your personal agent for work.
        </h2>
        <p className="text-gray-600 dark:text-[#a8a19b] text-lg mb-6 leading-relaxed">
          Sumora isn't just any AI. It's AI that knows your team inside and out.
          It adapts to your style, finds what you need and helps to get work
          done faster.
        </p>
        <a
          href="#"
          className="inline-flex items-center text-[#3b82f6] font-medium hover:text-[#60a5fa] transition-colors gap-2"
        >
          Learn more about Sumora AI <ArrowRight size={16} />
        </a>
      </div>

      {/* Feature 2 - Inactive */}
      <div className="border-l-2 border-transparent pl-6 py-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          One search to rule them all.
        </h2>
      </div>

      {/* Feature 3 - Inactive */}
      <div className="border-l-2 border-transparent pl-6 py-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          Bring CRM data right to the conversation.
        </h2>
      </div>

      {/* Stat */}
      <div className="pt-8">
        <h3 className="text-6xl sm:text-[5.5rem] font-sans font-bold text-gray-900 dark:text-[#ebe4de] tracking-tight mb-2">
          97 mins
        </h3>
        <p className="text-base font-semibold text-gray-900 dark:text-[#ebe4de] max-w-[280px] leading-snug">
          Average time that users can save weekly with AI in Sumora¹
        </p>
      </div>
    </div>

    {/* Feature Right side - Dashboard mockup image/focus */}
    <div className="relative">
      <div className="relative origin-left">
        {/* We reuse a smaller version of the dashboard or a crop of it */}
        <div className="w-[120%] lg:w-[140%] max-w-[800px] rounded-[24px] border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-[#161616]/30 p-2 overflow-hidden shadow-2xl backdrop-blur-sm -ml-4 lg:-ml-0">
          <div className="bg-white dark:bg-[#121110] rounded-[18px] border border-gray-200 dark:border-white/5 h-[400px] flex overflow-hidden w-full">
            {/* Left sidebar crop */}
            <div className="w-[70px] border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-5 gap-6 bg-[#f3f4f6]/50 dark:bg-[#0d0a08]/50">
              <div className="w-10 h-10 rounded-xl bg-[#5235e5] text-gray-900 dark:text-white flex items-center justify-center font-bold text-lg">
                S
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer text-[#5235e5]">
                <div className="w-12 h-10 rounded-xl bg-[#5235e5]/10 flex items-center justify-center">
                  <MessageSquare size={20} fill="#5235e5" />
                </div>
                <span className="text-[10px] font-medium">Chats</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400">
                <div className="w-12 h-10 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-medium">Groups</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400">
                <div className="w-12 h-10 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <span className="text-[10px] font-medium">Calls</span>
              </div>
            </div>
            {/* Middle sidebar crop */}
            <div className="w-[280px] border-r border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#121110]">
              <div className="px-5 py-6 flex items-center justify-between">
                <h2 className="text-gray-900 dark:text-white font-semibold text-xl">
                  Messages
                </h2>
                <Plus size={18} className="text-[#5235e5]" />
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
                    className="w-full bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-full py-2 pl-9 text-sm text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 px-3">
                <p className="text-[10px] font-semibold text-gray-500 mb-2 px-2 tracking-wider mt-2">
                  CHANNELS
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-2 py-2 bg-[#282142] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#5235e5] flex items-center justify-center text-[10px] text-gray-900 dark:text-white font-bold">
                      GN
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          # general
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-400 text-[10px]">
                          5:38
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-xs truncate">
                        Talan: all smooth
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#e3428d] flex items-center justify-center text-[10px] text-gray-900 dark:text-white font-bold shrink-0">
                      DT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                          # design-team
                        </span>
                        <span className="text-gray-500 text-[10px]">4:12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                          New mockups uploaded
                        </p>
                        <div className="w-4 h-4 rounded-full bg-[#5235e5] text-[9px] text-gray-900 dark:text-white font-bold flex items-center justify-center">
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Main chat crop */}
            <div className="flex-1 bg-white dark:bg-[#121110] flex flex-col relative w-full">
              <div className="absolute top-0 right-0 left-0 h-16 border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between bg-white dark:bg-[#121110] z-10 w-full pl-6">
                <div className="flex-1 max-w-sm bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl flex items-center px-4 h-10 ml-0">
                  <Search size={14} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search messages, channels..."
                    className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-full"
                  />
                </div>
              </div>
              <div className="h-16 mt-16 px-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-1">
                    # general
                  </h2>
                  <div className="flex -space-x-1.5 ml-2">
                    <div className="w-5 h-5 rounded-full bg-[#5235e5] border border-[#121110]"></div>
                    <div className="w-5 h-5 rounded-full bg-[#e3428d] border border-[#121110]"></div>
                    <div className="w-5 h-5 rounded-full bg-[#e3a842] border border-[#121110]"></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    9 Members ·{" "}
                    <span className="text-[#24a148] font-medium">4 Online</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <Search size={14} />
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-hidden">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#8242e3] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                    TK
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium mb-1">
                      Tiana Korsgaard{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        5:30 PM
                      </span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      It's going well. We've made some good progress on the
                      design and we're starting to work on the development
                      phase.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#e35642] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                    CD
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium mb-1">
                      Corey Dies{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        5:32 PM
                      </span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      That's great to hear. Have you run into any issues or
                      roadblocks so far?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 my-2">
                  <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
                  <span className="text-xs text-gray-600 font-medium">
                    Today
                  </span>
                  <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#24a148] flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold shrink-0">
                    TR
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium mb-1">
                      Talan Rosser{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        5:38 PM
                      </span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Not really, everything has been going smoothly. We did
                      have to make some changes to the initial plan...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
      text: "Love sumora edge functions. Cursor+Sumora+MCP+Docker desktop is all I need.",
    },
    {
      avatar: "PA",
      handle: "@pontusab",
      bgIcon: "bg-[#2D8CFF]",
      text: "I love everything about Sumora.",
    },
    {
      avatar: "NB",
      handle: "@nerdburn",
      bgIcon: "bg-[#5235e5]",
      text: "It's fun, feels lightweight, and really quick to spin up user auth and a few tables. Almost too easy! Highly recommend.",
    },
    {
      avatar: "AL",
      handle: "@adm_l",
      bgIcon: "bg-[#e3428d]",
      text: "Cursor integration is wonderful.",
    },
  ];

  const col2 = [
    {
      avatar: "MG",
      handle: "@xthemadgeniusx",
      bgIcon: "bg-[#24a148]",
      text: "Lately been using Sumora over AWS/ GCP for products to save on costs and rapid builds(Vibe Code) that do not need all the Infra and the hefty costs that come with AWS/ GCP out the door. Great solution overall.",
    },
    {
      avatar: "DD",
      handle: "@dadoos_",
      bgIcon: "bg-[#5235e5]",
      text: "Run sumora locally and just wow speed! This changes everything.",
    },
    {
      avatar: "OP",
      handle: "@orlandopedro_",
      bgIcon: "bg-[#000]",
      text: "Love @sumora custom domains makes the auth so much better.",
    },
  ];

  const col3 = [
    {
      avatar: "GI",
      handle: "@gokul_i",
      bgIcon: "bg-[#e3a842]",
      text: "First time running @sumora in local. It just works. Very good DX imo.",
    },
    {
      avatar: "SD",
      handle: "@sdusteric",
      bgIcon: "bg-[#5235e5]",
      text: "Loving #Sumora MCP. Claude Code would not only plan what data we should save but also figure out a migration script by checking what the schema looks like on.",
    },
    {
      avatar: "TB",
      handle: "@TyranBache",
      bgIcon: "bg-[#8242e3]",
      text: "Can't imagine going back to my old stack.",
    },
  ];

  const col4 = [
    {
      avatar: "PC",
      handle: "@patrickc",
      bgIcon: "bg-[#e3a842]",
      text: "Very impressed by @sumora's growth. For new startups, they seem to have gone from 'promising' to 'standard' in remarkably short order.",
    },
    {
      avatar: "VM",
      handle: "@viratt_mank",
      bgIcon: "bg-[#8242e3]",
      text: "Truly a game changer for independent devs.",
    },
    {
      avatar: "AL",
      handle: "@adm_lawson",
      bgIcon: "bg-[#e3428d]",
      text: "Love sumora edge functions. Cursor+Sumora+MCP+Docker desktop is all I need.",
    },
  ];

  return (
    <section className="py-32 px-4 max-w-[1200px] mx-auto text-center relative z-10 w-full mb-10 text-gray-900 dark:text-white">
      <h2 className="text-[2.5rem] sm:text-[3.5rem] font-semibold text-gray-900 dark:text-white tracking-tight mb-4 inline-block w-full">
        Join the community
      </h2>
      <p className="text-gray-600 dark:text-[#a8a19b] text-lg mb-10 w-full block">
        Discover what our community has to say about their Sumora experience.
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

const Footer = () => (
  <footer className="relative z-10 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#121110] pt-24 pb-12 w-full mt-auto text-gray-900 dark:text-white">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-12 gap-16 mb-24">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-wide">
            SUMORA
          </div>
          <p className="text-gray-600 dark:text-[#a8a19b] min-w-[280px] max-w-sm mb-8 text-[15px] leading-relaxed font-light">
            Unlock seamless communication and streamline your messaging
            experience with our innovative next-gen dashboard solution.
          </p>
          <div className="flex items-center gap-5 text-gray-500">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.6177-1.2498a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Integrations
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Changelog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Docs
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Resources
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                API Reference
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:pl-6">
          <h4 className="text-gray-900 dark:text-white font-medium mb-6">
            Company
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-black/5 dark:bg-white/5 border-t border-gray-200 dark:border-white/5 mb-8"></div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 Sumora. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cookie Management
          </a>
        </div>
      </div>
    </div>
  </footer>
);

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

const HomePage = () => {
  const { user, loading } = useAuth();
  const [showAccount, setShowAccount] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0e0a09]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-white relative flex flex-col bg-white dark:bg-[#0e0a09] selection:bg-[#ea580c] selection:text-gray-900 dark:selection:text-white overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        @keyframes beam {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); opacity: 0.7; }
          50% { transform: translateX(-50%) rotate(2deg); opacity: 1; }
        }
        .animate-beam {
          animation: beam 8s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.6; transform: translateX(-50%) scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `,
        }}
      />

      <BackgroundGradient />

      {/* Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center py-4">
        <header className="relative flex h-[70px] items-center px-6 md:px-12 w-full max-w-[1500px] mx-auto bg-transparent border-transparent">
          {/* Logo */}
          <div className="flex-1 flex items-center gap-2 text-[19px] font-bold tracking-tight text-gray-900 dark:text-white z-10 shrink-0">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-[10px] flex items-center justify-center text-black dark:text-white">
              <MessageSquare size={16} fill="black" />
            </div>
            Sumora
          </div>

          {/* Center Links (Capsule with single snake animation) */}
          <div className="hidden md:flex flex-none z-10 p-[1px] rounded-[30px] overflow-hidden absolute left-1/2 -translate-x-1/2">
            {/* Spinning single Snake background */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_80%,#ea580c_100%)] opacity-100 z-0" />

            <nav className="relative z-10 flex items-center gap-8 px-8 py-[10px] rounded-[30px] text-[14px] font-medium text-gray-700 dark:text-gray-300 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md">
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Docs
              </a>
            </nav>
          </div>

          {/* Right Nav */}
          <div className="flex-1 flex justify-end items-center gap-3 z-10">
            <div className="flex items-center rounded-[30px] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 p-1 mr-2 backdrop-blur-md gap-1">
              <div
                onClick={() => setTheme("light")}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "light" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <Sun size={14} fill="currentColor" />
              </div>
              <div
                onClick={() => setTheme("dark")}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${theme === "dark" ? "bg-[#333] text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}
              >
                <Moon size={14} fill="currentColor" />
              </div>
            </div>

            {user ? (
              <UserDropdown onManageAccount={() => setShowAccount(true)} />
            ) : (
              <Link
                to="/login"
                className="w-[36px] h-[36px] rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center hover:opacity-80 transition-opacity text-sm"
              >
                S
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1 flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative pt-[120px] pb-12 flex flex-col items-center text-center px-4 w-full max-w-[1400px] mx-auto">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-500 dark:text-[#ab9b95] mb-6 uppercase">
            UNLOCK CONVERSATIONAL POWER
          </p>
          <h1 className="text-[1.5rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] font-sans font-bold tracking-[-0.04em] text-gray-900 dark:text-[#ebe4de] max-w-2xl leading-[1.15] mb-4">
            Empower Your
            <br />
            Conversations with
            <br />
            Next-Gen Messaging
            <br />
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-[#a8a19b] max-w-[580px] mb-6 text-[17px] leading-[1.6]">
            Unlock seamless communication and streamline your messaging
            experience with our innovative dashboard solution.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="h-[46px] px-8 rounded-full border border-gray-400 hover:border-gray-900 dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/10 text-gray-900 dark:text-[#ebe4de] text-sm font-semibold transition-all mb-10 flex items-center justify-center"
            >
              Continue to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="h-[46px] flex items-center justify-center px-8 rounded-full border border-gray-400 hover:border-gray-900 dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/10 text-gray-900 dark:text-[#ebe4de] text-sm font-semibold transition-all mb-10"
            >
              Get Started
            </Link>
          )}
        </section>

        <DashboardMockup />

        <IntegrationsSection />

        <FeatureSection />

        <CommunitySection />
      </main>

      <Footer />

      {/* Account Modal */}
      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
    </div>
  );
};

export default HomePage;
