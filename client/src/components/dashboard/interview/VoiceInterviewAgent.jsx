import { useEffect, useState, useCallback, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Loader2,
  Radio,
  MessageSquare,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDeepgramVoiceAgent } from "../../../hooks/useDeepgramVoiceAgent";
import { useInterview } from "../../../context/InterviewContext";

/**
 * VoiceInterviewAgent — Real-time voice interview using Deepgram Voice Agent
 *
 * Props:
 *   interviewId       — string
 *   systemPrompt      — string (AI persona instructions)
 *   context           — object (role, jobDescription, subject, topic, etc.)
 *   onTranscriptUpdate — (transcript) => void
 *   onEnd             — () => void
 */

// ── Animated voice waveform ────────────────────────────────────────────────────

const VoiceWaveform = ({ active, color = "#ea580c" }) => (
  <div className="flex items-end gap-[3px] h-10">
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <span
        key={i}
        className="w-1 rounded-full transition-all"
        style={{
          backgroundColor: color,
          animation: active ? `wave 0.9s ease-in-out infinite` : "none",
          animationDelay: active ? `${i * 0.1}s` : "0s",
          height: active ? "100%" : "20%",
        }}
      />
    ))}
    <style>{`
      @keyframes wave {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

// ── Conversation transcript bubble ────────────────────────────────────────────

const TranscriptBubble = ({ role, text, timestamp }) => {
  const isAgent = role === "agent";
  return (
    <div
      className={`flex items-start gap-3 ${isAgent ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isAgent
            ? "bg-[#ea580c]/10 text-[#ea580c]"
            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }`}
      >
        {isAgent ? <Radio size={14} /> : <Mic size={14} />}
      </div>
      <div className="flex-1 max-w-[80%] space-y-1">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAgent
              ? "bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2a2a2a]"
              : "bg-blue-500/10 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30"
          }`}
        >
          <p
            className={`text-sm leading-relaxed ${
              isAgent
                ? "text-gray-800 dark:text-gray-200"
                : "text-blue-900 dark:text-blue-100"
            }`}
          >
            {text}
          </p>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 px-2">
          {timestamp}
        </p>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function VoiceInterviewAgent({
  interviewId,
  systemPrompt,
  context,
  onTranscriptUpdate,
  onEnd,
}) {
  const { endInterview } = useInterview();
  const [isEnding, setIsEnding] = useState(false);

  const [transcript, setTranscript] = useState([]);
  const [currentUserText, setCurrentUserText] = useState("");
  const [currentAgentText, setCurrentAgentText] = useState("");
  const transcriptEndRef = useRef(null);

  const handleTranscript = useCallback(
    (text) => {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTranscript((prev) => [...prev, { role: "user", text, timestamp }]);
      setCurrentUserText("");
      onTranscriptUpdate?.({ role: "user", text, timestamp });
    },
    [onTranscriptUpdate],
  );

  const handleAgentMessage = useCallback(
    (text) => {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTranscript((prev) => [...prev, { role: "agent", text, timestamp }]);
      setCurrentAgentText("");
      onTranscriptUpdate?.({ role: "agent", text, timestamp });
    },
    [onTranscriptUpdate],
  );

  const handleError = useCallback((error) => {
    console.error("[Voice Agent Error]", error);
    toast.error(error || "Voice agent error");
  }, []);

  const {
    connect,
    disconnect,
    sendMessage,
    flushAgentQueues,
    isConnected,
    isLoading,
    isAgentSpeaking,
    isUserSpeaking,
  } = useDeepgramVoiceAgent({
    onTranscript: handleTranscript,
    onAgentMessage: handleAgentMessage,
    onError: handleError,
  });

  const [isHoldingToSpeak, setIsHoldingToSpeak] = useState(false);

  const startHolding = useCallback(() => {
    window.isSpacePressed = true;
    setIsHoldingToSpeak(true);
  }, []);

  const stopHolding = useCallback(() => {
    window.isSpacePressed = false;
    setIsHoldingToSpeak(false);
    flushAgentQueues();
  }, [flushAgentQueues]);

  // Auto-connect on mount
  useEffect(() => {
    connect({
      systemPrompt,
      context: { ...context, interviewId },
    });

    const handleKeyDown = (e) => {
      // Ignore space if typing in an input field (just in case)
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        startHolding();
      }
    };

    const handleKeyUp = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        stopHolding();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      disconnect();
    };
  }, [
    interviewId,
    connect,
    disconnect,
    context,
    systemPrompt,
    startHolding,
    stopHolding,
  ]);

  // Auto-scroll to latest message
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleEndInterview = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);
    disconnect();

    if (context?.interviewMode === "interactive") {
      toast.success(
        "Great job keeping up! Keep practicing. Use Analytic mode next time to generate detailed reports.",
        { duration: 5000 },
      );
      onEnd?.(null, null); // Provide nulls to skip report generation rendering
      setIsEnding(false);
      return;
    }

    try {
      const data = await endInterview(interviewId);
      onEnd?.(data.feedback, data.score);
    } catch (error) {
      console.error("Failed to end interview:", error);
      toast.error("Failed to generate report.");
      onEnd?.(null, null);
    } finally {
      setIsEnding(false);
    }
  }, [disconnect, endInterview, interviewId, onEnd, isEnding, context]);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#ea580c]/10 flex items-center justify-center">
            <Radio size={18} className="text-[#ea580c]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Live Voice Interview
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Connected • Speak naturally
                </>
              ) : isLoading ? (
                <>
                  <Loader2 size={10} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Disconnected
                </>
              )}
            </p>
          </div>
        </div>

        {/* End interview button */}
        <button
          onClick={handleEndInterview}
          disabled={(!isConnected && !isLoading) || isEnding}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <PhoneOff size={14} />
          )}
          {isEnding ? "Ending..." : "End Interview"}
        </button>
      </div>

      {/* Real-time status indicator */}
      <div className="mb-6">
        <div className="relative rounded-2xl border-2 border-gray-200 dark:border-[#2a2a2a] bg-gradient-to-br from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#161616] p-6 overflow-hidden">
          {/* Animated background glow */}
          {isAgentSpeaking && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#ea580c]/10 via-transparent to-[#ea580c]/10 animate-pulse" />
          )}
          {isUserSpeaking && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 animate-pulse" />
          )}

          <div className="relative z-10 flex items-center justify-between">
            {/* Agent speaking indicator */}
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                  isAgentSpeaking
                    ? "bg-[#ea580c] shadow-lg shadow-[#ea580c]/50"
                    : "bg-gray-200 dark:bg-[#2a2a2a]"
                }`}
              >
                <Volume2
                  size={20}
                  className={isAgentSpeaking ? "text-white" : "text-gray-400"}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isAgentSpeaking
                      ? "text-[#ea580c]"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  AI Interviewer
                </p>
                {isAgentSpeaking ? (
                  <VoiceWaveform active={true} color="#ea580c" />
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Listening...
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-300 dark:bg-[#333] mx-6" />

            {/* User speaking indicator */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 flex flex-col items-end">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isUserSpeaking
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  You
                </p>
                {isUserSpeaking ? (
                  <VoiceWaveform active={true} color="#3b82f6" />
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {isConnected ? "Ready to speak" : "Waiting..."}
                  </p>
                )}
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                  isUserSpeaking
                    ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                    : "bg-gray-200 dark:bg-[#2a2a2a]"
                }`}
              >
                <Mic
                  size={20}
                  className={isUserSpeaking ? "text-white" : "text-gray-400"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation transcript */}
      <div className="flex-1 overflow-y-auto px-1">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-[#1e1e1e] flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Conversation Started
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              The AI interviewer will begin asking questions. Speak naturally
              and the conversation will flow automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {transcript.map((msg, idx) => (
              <TranscriptBubble
                key={idx}
                role={msg.role}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      {/* Tips footer and Hold to speak button */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Mobile / Desktop Hold to Speak Button */}
        <button
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent scrolling/zooming when holding
            startHolding();
          }}
          onTouchEnd={stopHolding}
          onTouchCancel={stopHolding}
          className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-sm transition-all select-none flex-shrink-0 ${
            isHoldingToSpeak
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-95"
              : "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Mic
              size={18}
              className={isHoldingToSpeak ? "animate-pulse" : ""}
            />
            {isHoldingToSpeak ? "Listening..." : "Hold to Speak"}
          </div>
        </button>

        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Zap size={12} className="flex-shrink-0 mt-0.5 text-[#ea580c]" />
          <p>
            <strong>Pro tip:</strong> Hold the <strong>Spacebar</strong> or the
            button to speak without interruption. The AI will listen and wait
            for you to release it!
          </p>
        </div>
      </div>
    </div>
  );
}
