/**
 * InterviewChat.jsx
 *
 * Phase 2 UI: display the current interview question, accept the candidate's
 * answer (voice or text), and allow them to submit or end the interview.
 *
 * Props:
 *   interviewId       — string
 *   currentQuestion   — string   (the AI's latest question)
 *   questionIndex     — number   (1-based; shown as "Q1", "Q2", …)
 *   history           — Array<{ question, answer }> (previous turns, displayed below)
 *   onAnswer(nextQ)   — called with the next question after the server responds
 *   onEnd(feedback)   — called with the structured feedback object when interview ends
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Send,
  StopCircle,
  Volume2,
  VolumeX,
  Loader2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";

// ── Speech recognition factory ────────────────────────────────────────────────

function createRecognition(onResult, onEnd) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";

  let finalTranscript = "";

  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalTranscript += t + " ";
      else interim = t;
    }
    onResult((finalTranscript + interim).trimStart());
  };

  rec.onend = () => {
    onEnd(finalTranscript.trim());
    finalTranscript = "";
  };

  rec.onerror = (e) => {
    if (e.error !== "no-speech" && e.error !== "aborted") {
      toast.error("Microphone error: " + e.error);
    }
    onEnd(finalTranscript.trim());
    finalTranscript = "";
  };

  return rec;
}

// ── Animated voice waveform ────────────────────────────────────────────────────

const VoiceWaveform = ({ active }) => (
  <div className="flex items-end gap-[3px] h-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-[#ea580c] transition-all"
        style={
          active
            ? {
                animation: `wave 0.9s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                height: "100%",
              }
            : { height: "25%" }
        }
      />
    ))}
    <style>{`
      @keyframes wave {
        0%, 100% { transform: scaleY(0.25); }
        50% { transform: scaleY(1); }
      }
    `}</style>
  </div>
);

// ── History bubble ────────────────────────────────────────────────────────────

const HistoryTurn = ({ turn, index }) => (
  <div className="space-y-2">
    <div className="flex items-start gap-2">
      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#ea580c]/10 text-[#ea580c] text-[10px] font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
        {turn.question}
      </p>
    </div>
    {turn.answer && (
      <div className="ml-7 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl px-4 py-3 border border-gray-100 dark:border-[#222]">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {turn.answer}
        </p>
      </div>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export default function InterviewChat({
  interviewId,
  currentQuestion,
  questionIndex,
  history,
  onAnswer,
  onEnd,
}) {
  const { answerInterview, endInterview, tts } = useInterview();

  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [hasSpeechRec] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );

  const recRef = useRef(null);
  const audioRef = useRef(null);
  const textareaRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsVoiceLoading(false);
    setIsSpeaking(false);
  }, []);

  const speakWithSarvam = useCallback(
    async (text) => {
      stopAudio();
      setIsVoiceLoading(true);
      try {
        const base64 = await tts(text);
        const audio = new Audio(`data:audio/wav;base64,${base64}`);
        audioRef.current = audio;
        setIsVoiceLoading(false);
        setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } catch {
        setIsVoiceLoading(false);
        setIsSpeaking(false);
      }
    },
    [tts, stopAudio],
  );

  // Auto-play the question when it changes
  useEffect(() => {
    speakWithSarvam(currentQuestion);
    setAnswer("");
    textareaRef.current?.focus();
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recRef.current?.stop();
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recRef.current?.stop();
      setIsRecording(false);
    } else {
      const rec = createRecognition(
        (transcript) => setAnswer(transcript),
        (finalText) => {
          if (finalText) setAnswer(finalText);
          setIsRecording(false);
        },
      );
      if (!rec) {
        toast.error("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        rec.start();
        recRef.current = rec;
        setIsRecording(true);
      } catch {
        toast.error("Could not access microphone.");
      }
    }
  }, [isRecording]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please type or speak your answer first.");
      return;
    }
    if (isRecording) {
      recRef.current?.stop();
      setIsRecording(false);
    }

    setSubmitLoading(true);
    try {
      const data = await answerInterview(interviewId, answer.trim());
      onAnswer(data.question, answer.trim());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEndInterview = async () => {
    if (isRecording) {
      recRef.current?.stop();
      setIsRecording(false);
    }
    stopAudio();

    setEndLoading(true);
    try {
      const data = await endInterview(interviewId);
      onEnd(data.feedback, data.score);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end interview.");
    } finally {
      setEndLoading(false);
    }
  };

  const handleReplayQuestion = () => speakWithSarvam(currentQuestion);

  return (
    <div className="max-w-2xl space-y-5">
      {/* ── Current question card ── */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        {(isSpeaking || isVoiceLoading) && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#ea580c]/[0.03] rounded-2xl pointer-events-none" />
        )}

        <div className="relative z-10">
          {/* Question number — always visible */}
          <div className="flex items-center justify-between flex-wrap gap-y-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c]">
              Question {questionIndex}
            </span>

            {!isVoiceLoading && (
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={stopAudio}
                    title="Stop speaking"
                    className="flex items-center gap-1.5 text-[11px] text-[#ea580c] hover:text-white transition-colors"
                  >
                    <VolumeX size={13} />
                    <VoiceWaveform active={isSpeaking} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReplayQuestion}
                    title="Replay question"
                    className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    <Volume2 size={13} />
                    <VoiceWaveform active={false} />
                  </button>
                )}
              </div>
            )}
          </div>

          {isVoiceLoading ? (
            /* Full card skeleton */
            <div className="animate-pulse space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-1">
                <Loader2 size={10} className="animate-spin text-gray-500" />
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Preparing voice…
                </span>
              </div>
              <div className="h-3.5 bg-white/10 rounded-full w-full" />
              <div className="h-3.5 bg-white/10 rounded-full w-5/6" />
              <div className="h-3.5 bg-white/10 rounded-full w-3/4" />
            </div>
          ) : (
            <>
              {isSpeaking && (
                <div className="inline-flex items-center gap-1.5 bg-[#ea580c]/15 border border-[#ea580c]/25 rounded-full px-3 py-1 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                  <span className="text-[10px] font-medium text-[#ea580c] tracking-wide">
                    Speaking
                  </span>
                </div>
              )}
              <p className="text-white text-[15px] font-medium leading-relaxed">
                {currentQuestion}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Answer input ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Your Answer
          </p>
          {hasSpeechRec && (
            <button
              type="button"
              onClick={toggleRecording}
              className={[
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                isRecording
                  ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                  : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]",
              ].join(" ")}
            >
              {isRecording ? (
                <>
                  <MicOff size={13} /> Stop recording
                </>
              ) : (
                <>
                  <Mic size={13} /> Use microphone
                </>
              )}
            </button>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={
            isRecording
              ? "Listening… speak clearly into your microphone."
              : "Type your answer here, or use the microphone button above…"
          }
          rows={5}
          disabled={submitLoading || endLoading}
          className="w-full rounded-xl border border-gray-200 dark:border-[#333] px-4 py-3 text-sm text-gray-900 dark:text-gray-200 bg-transparent dark:bg-[#1e1e1e] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none disabled:opacity-60"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
          {answer.length} characters
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleSubmitAnswer}
          disabled={submitLoading || endLoading || !answer.trim()}
          className="flex-1 h-12 rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span className="hidden sm:inline">Getting next question…</span>
              <span className="sm:hidden">Loading…</span>
            </>
          ) : (
            <>
              <Send size={14} /> Submit Answer
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleEndInterview}
          disabled={submitLoading || endLoading}
          className="h-12 px-5 rounded-xl bg-gray-100 dark:bg-[#222] text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-[#2a2a2a] focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0"
        >
          {endLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span className="hidden sm:inline">Generating feedback…</span>
              <span className="sm:hidden">Loading…</span>
            </>
          ) : (
            <>
              <StopCircle size={14} /> End Interview
            </>
          )}
        </button>
      </div>

      {/* ── Previous Q&A history ── */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Interview History
            </p>
          </div>
          <div className="space-y-5">
            {history.map((turn, i) => (
              <HistoryTurn key={i} turn={turn} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
