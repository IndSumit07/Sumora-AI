import { useState, useRef, useCallback } from "react";

const TTS_URL = "https://api.deepgram.com/v1/speak?model=aura-2-ophelia-en";

/**
 * useDeepgramTTS — TTS via Deepgram Aura REST API.
 * Requires VITE_DEEPGRAM_API_KEY in the environment.
 * Drop-in replacement for useKokoroTTS (same returned interface).
 */
export function useDeepgramTTS() {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef(null);
  const abortRef = useRef(false);

  const stop = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setIsSynthesizing(false);
  }, []);

  const speak = useCallback(
    async (text) => {
      stop();
      abortRef.current = false;
      if (!text?.trim()) return;

      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      if (!apiKey) {
        console.warn("[DeepgramTTS] VITE_DEEPGRAM_API_KEY is not set");
        return;
      }

      setIsSynthesizing(true);
      try {
        const res = await fetch(TTS_URL, {
          method: "POST",
          headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error(`Deepgram TTS error: ${res.status}`);
        if (abortRef.current) return;

        const blob = await res.blob();
        if (abortRef.current) return;

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        setIsSynthesizing(false);
        setIsSpeaking(true);

        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsSpeaking(false);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsSpeaking(false);
        };

        await audio.play();
      } catch (err) {
        if (!abortRef.current) console.error("[DeepgramTTS]", err);
        setIsSynthesizing(false);
        setIsSpeaking(false);
      }
    },
    [stop],
  );

  // isModelLoading is always false — Deepgram requires no local model download
  return { speak, stop, isSpeaking, isSynthesizing, isModelLoading: false };
}
