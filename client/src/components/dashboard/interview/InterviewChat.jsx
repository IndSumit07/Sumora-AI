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
  Loader2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";

// ── Speech synthesis ──────────────────────────────────────────────────────────

function speakText(text, voiceURI) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  if (voiceURI) {
    const found = voices.find((v) => v.voiceURI === voiceURI);
    if (found) utter.voice = found;
  } else {
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural")),
    );
    if (preferred) utter.voice = preferred;
  }
  window.speechSynthesis.speak(utter);
}

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
  const { answerInterview, endInterview } = useInterview();

  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [hasSpeechRec] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(
    () => localStorage.getItem("iv_voice") || "",
  );

  const recRef = useRef(null);
  const textareaRef = useRef(null);
  // Keep a ref so the autoplay effect always reads the latest voice
  const voiceURIRef = useRef(selectedVoiceURI);
  useEffect(() => { voiceURIRef.current = selectedVoiceURI; }, [selectedVoiceURI]);

  // Load available English voices (async in most browsers)
  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis?.getVoices().filter((v) => v.lang.startsWith("en")) ?? [];
      setVoices(all);
      if (!voiceURIRef.current && all.length) {
        const preferred =
          all.find((v) => v.name.includes("Google") || v.name.includes("Natural")) || all[0];
        setSelectedVoiceURI(preferred.voiceURI);
        voiceURIRef.current = preferred.voiceURI;
      }
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVoiceChange = (uri) => {
    setSelectedVoiceURI(uri);
    localStorage.setItem("iv_voice", uri);
  };

  // Auto-play the question when it changes
  useEffect(() => {
    speakText(currentQuestion, voiceURIRef.current);
    setAnswer("");
    textareaRef.current?.focus();
    return () => window.speechSynthesis?.cancel();
  }, [currentQuestion]);

  // Cleanup microphone on unmount
  useEffect(() => {
    return () => {
      recRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
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
    window.speechSynthesis?.cancel();

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

  const handleReplayQuestion = () => speakText(currentQuestion, voiceURIRef.current);

  return (
    <div className="max-w-2xl space-y-5">
      {/* ── Current question card ── */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c]">
              Question {questionIndex}
            </span>
            <div className="flex items-center gap-2">
              {voices.length > 0 && (
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="text-[11px] bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-[#ea580c] max-w-[140px] truncate cursor-pointer"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI} className="bg-[#1a1a1a] text-gray-200">
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={handleReplayQuestion}
                title="Replay question"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Volume2 size={13} />
                Play
              </button>
            </div>
          </div>
          <p className="text-white text-[15px] font-medium leading-relaxed">
            {currentQuestion}
          </p>
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
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmitAnswer}
          disabled={submitLoading || endLoading || !answer.trim()}
          className="flex-1 h-12 rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Getting next
              question…
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
          className="h-12 px-5 rounded-xl bg-gray-100 dark:bg-[#222] text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-[#2a2a2a] focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {endLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Generating
              feedback…
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
