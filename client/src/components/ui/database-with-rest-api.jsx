import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  Sparkles,
  Volume2,
  Activity,
  Waves,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function DatabaseWithRestApi({ className }) {
  return (
    <div
      className={cn(
        "w-full h-full p-2 lg:p-6 flex flex-col justify-center items-center",
        className,
      )}
    >
      <div className="w-full max-w-[900px] flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 250"
          className="w-full h-auto text-gray-700 dark:text-gray-300 drop-shadow-lg"
          style={{ minHeight: "400px" }}
        >
          <defs>
            <linearGradient id="mainBoxGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#27272a" stopOpacity="0.4"></stop>
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.8"></stop>
            </linearGradient>
            <radialGradient id="db-orange-grad" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="1" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="db-blue-grad" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
            <clipPath id="engineClip">
              <rect x="25" y="145" width="310" height="100" rx="8" />
            </clipPath>
            <filter id="snakeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="1.5"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* PATHS - BACKGROUND. Mapped exact to offset-paths in index.css */}
          {/* Note that lines drop DOWN, then ACROSS, then DOWN to exactly x=180, y=76 */}
          <g
            fill="none"
            strokeWidth="0.6"
            className="stroke-zinc-300 dark:stroke-[#52525b] opacity-60"
          >
            {/* 1. Deepgram STT */}
            <path d="M 41 26 v 20 q 0 5 5 5 h 129 q 5 0 5 5 v 20" />
            {/* 2. GPT4o Mini */}
            <path d="M 106 26 v 10 q 0 5 5 5 h 64 q 5 0 5 5 v 30" />
            {/* 3. Gemini 2.5 Flash */}
            <path d="M 180 26 v 50" />
            {/* 4. Llama 3.1 70B */}
            <path d="M 248 26 v 10 q 0 5 -5 5 h -58 q -5 0 -5 5 v 30" />
            {/* 5. Deepgram Aura */}
            <path d="M 314 26 v 20 q 0 5 -5 5 h -124 q -5 0 -5 5 v 20" />

            {/* Langchain -> Sumora Engine */}
            <path
              d="M 180 102 v 43"
              strokeWidth="1.2"
              stroke="#ea580c"
              className="opacity-80"
            />
          </g>

          {/* BACKGROUND GLOW */}
          <rect
            x="25"
            y="145"
            width="310"
            height="100"
            rx="8"
            fill="#ea580c"
            opacity="0.03"
            filter="blur(20px)"
          />

          {/* MAIN BOX CONTAINER */}
          <rect
            className="block dark:hidden"
            x="25"
            y="145"
            width="310"
            height="100"
            rx="8"
            fill="#f4f4f5"
            stroke="#d4d4d8"
            strokeWidth="0.5"
          />
          <rect
            className="hidden dark:block"
            x="25"
            y="145"
            width="310"
            height="100"
            rx="8"
            fill="url(#mainBoxGrad)"
            stroke="#3f3f46"
            strokeWidth="0.5"
          />

          {/* ANIMATED SNAKES */}
          <g
            fill="none"
            strokeWidth="0.8"
            strokeLinecap="round"
            filter="url(#snakeGlow)"
          >
            {/* 1. STT -> Langchain */}
            <path
              d="M 41 26 v 20 q 0 5 5 5 h 129 q 5 0 5 5 v 20"
              stroke="#ea580c"
              pathLength="100"
              strokeDasharray="15 85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* 2. GPT -> Langchain */}
            <path
              d="M 106 26 v 10 q 0 5 5 5 h 64 q 5 0 5 5 v 30"
              stroke="#ea580c"
              pathLength="100"
              strokeDasharray="15 85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="2.5s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* 3. Gemini -> Langchain */}
            <path
              d="M 180 26 v 50"
              stroke="#ea580c"
              pathLength="100"
              strokeDasharray="15 85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="2.5s"
                begin="1s"
                repeatCount="indefinite"
              />
            </path>
            {/* 4. Llama -> Langchain */}
            <path
              d="M 248 26 v 10 q 0 5 -5 5 h -58 q -5 0 -5 5 v 30"
              stroke="#ea580c"
              pathLength="100"
              strokeDasharray="15 85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="2.5s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* 5. Aura -> Langchain */}
            <path
              d="M 314 26 v 20 q 0 5 -5 5 h -124 q -5 0 -5 5 v 20"
              stroke="#ea580c"
              pathLength="100"
              strokeDasharray="15 85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="2.5s"
                begin="2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Blue Snake -> Down and completely covers the main box */}
            <path
              d="M 180 102 v 43 h 147 a 8 8 0 0 1 8 8 v 84 a 8 8 0 0 1 -8 8 h -294 a 8 8 0 0 1 -8 -8 v -84 a 8 8 0 0 1 8 -8 h 147"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              pathLength="100"
              strokeDasharray="25 75"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* TOP 5 MODEL BOXES */}

          {/* 1) Deepgram STT */}
          <g transform="translate(13, 10)">
            <rect
              width="60"
              height="16"
              rx="4"
              strokeWidth="0.6"
              className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="5" y="3.5" width="9" height="9">
              <Mic className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="18"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e2e8f0]"
              fontSize="5"
              fontWeight="500"
            >
              Deepgram STT
            </text>
          </g>

          {/* 2) GPT-4o Mini */}
          <g transform="translate(76, 10)">
            <rect
              width="60"
              height="16"
              rx="4"
              strokeWidth="0.6"
              className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="5" y="3.5" width="9" height="9">
              <Brain className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="17"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e2e8f0]"
              fontSize="5"
              fontWeight="500"
            >
              GPT-4o Mini
            </text>
          </g>

          {/* 3) Gemini 2.5 Flash */}
          <g transform="translate(139, 10)">
            <rect
              width="78"
              height="16"
              rx="4"
              strokeWidth="0.6"
              className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="6" y="3.5" width="9" height="9">
              <Zap className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="18"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e2e8f0]"
              fontSize="5"
              fontWeight="500"
            >
              Gemini 2.5 Flash
            </text>
          </g>

          {/* 4) Llama 3.1 70B */}
          <g transform="translate(220, 10)">
            <rect
              width="52"
              height="16"
              rx="4"
              strokeWidth="0.6"
              className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="6" y="3.5" width="9" height="9">
              <Activity className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="18"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e2e8f0]"
              fontSize="5"
              fontWeight="500"
            >
              Llama 3.1
            </text>
          </g>

          {/* 5) Deepgram Aura */}
          <g transform="translate(275, 10)">
            <rect
              width="72"
              height="16"
              rx="4"
              strokeWidth="0.6"
              className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="5" y="3.5" width="9" height="9">
              <Volume2 className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="17"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e2e8f0]"
              fontSize="5"
              fontWeight="500"
            >
              Deepgram Aura
            </text>
          </g>

          {/* LANGCHAIN ORCHESTRATION BOX */}
          <g transform="translate(112, 76)">
            <rect
              width="136"
              height="26"
              rx="4"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              className="fill-sky-50 dark:fill-[#111827]"
            />
            <foreignObject x="14" y="6" width="14" height="14">
              <Waves className="w-full h-full text-[#0ea5e9]" />
            </foreignObject>
            <text
              x="34"
              y="14"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-sky-950 dark:fill-[#f8fafc]"
              fontSize="7"
              fontWeight="500"
            >
              Langchain Orchestration
            </text>
          </g>

          {/* "POWERED BY MULTI-AGENT AI" BADGE ON TOP EDGE */}
          <g transform="translate(115, 137)">
            <rect
              width="130"
              height="16"
              rx="8"
              strokeWidth="0.6"
              className="fill-zinc-100 dark:fill-[#27272a] stroke-zinc-300 dark:stroke-[#52525b]"
            />
            <foreignObject x="18" y="4.5" width="7" height="7">
              <Sparkles className="w-full h-full text-[#ea580c]" />
            </foreignObject>
            <text
              x="30"
              y="8.5"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              className="fill-zinc-800 dark:fill-[#e5e7eb]"
              fontSize="5.5"
              fontWeight="500"
            >
              Powered by Multi-Agent AI
            </text>
          </g>

          {/* INSIDE THE MAIN CONTAINER: BADGES + ENGINE */}
          <g clipPath="url(#engineClip)">
            {/* Inner Badges */}
            <g transform="translate(45, 175)">
              <rect
                width="78"
                height="14"
                rx="4"
                className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#3f3f46]"
              />
              <foreignObject x="6" y="3.5" width="7" height="7">
                <Zap className="w-full h-full text-[#60a5fa]" />
              </foreignObject>
              <text
                x="17"
                y="7.5"
                alignmentBaseline="middle"
                dominantBaseline="middle"
                className="fill-zinc-800 dark:fill-[#d1d5db]"
                fontSize="4.5"
                fontWeight="400"
              >
                Ultra-Low Latency
              </text>
            </g>

            <g transform="translate(232, 210)">
              <rect
                width="82"
                height="14"
                rx="4"
                className="fill-white dark:fill-[#18181b] stroke-zinc-300 dark:stroke-[#3f3f46]"
              />
              <foreignObject x="6" y="3.5" width="7" height="7">
                <Brain className="w-full h-full text-[#4ade80]" />
              </foreignObject>
              <text
                x="17"
                y="7.5"
                alignmentBaseline="middle"
                dominantBaseline="middle"
                className="fill-zinc-800 dark:fill-[#d1d5db]"
                fontSize="4.5"
                fontWeight="400"
              >
                Real-Time Context
              </text>
            </g>

            {/* Radial Dashboard Rings */}
            <g stroke="#ea580c" strokeDasharray="4 3" fill="none">
              <circle
                cx="180"
                cy="230"
                r="40"
                strokeWidth="0.6"
                opacity="0.5"
              />
              <circle
                cx="180"
                cy="230"
                r="58"
                strokeWidth="0.4"
                opacity="0.3"
              />
              <circle
                cx="180"
                cy="230"
                r="80"
                strokeWidth="0.2"
                opacity="0.2"
              />
              <circle
                cx="180"
                cy="230"
                r="105"
                strokeWidth="0.2"
                opacity="0.1"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default DatabaseWithRestApi;
