import { useState, useRef, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../lib/api";

const DEEPGRAM_AGENT_WS_URL = "wss://agent.deepgram.com/v1/agent/converse";

export function useDeepgramVoiceAgent({
  onTranscript,
  onAgentMessage,
  onError,
  apiEndpoint,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const contextRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);
  const isConnectingRef = useRef(false);
  const activeConnectionIdRef = useRef(0);

  const playbackContextRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const activeSourcesRef = useRef(0);

  // Queue to hold Agent responses while spacebar is held
  const queuedBlobsRef = useRef([]);
  const queuedTextRef = useRef([]);
  const lastConversationTextRef = useRef({
    user: { text: "", ts: 0 },
    agent: { text: "", ts: 0 },
  });

  const normalizeText = useCallback(
    (value) => (value || "").replace(/\s+/g, " ").trim().toLowerCase(),
    [],
  );

  const isDuplicateConversationText = useCallback(
    (role, content) => {
      const key = role === "user" ? "user" : "agent";
      const normalized = normalizeText(content);
      if (!normalized) return true;

      const now = Date.now();
      const previous = lastConversationTextRef.current[key];
      if (previous.text === normalized && now - previous.ts < 4000) {
        return true;
      }

      lastConversationTextRef.current[key] = { text: normalized, ts: now };
      return false;
    },
    [normalizeText],
  );

  // Immediately stop all agent audio playback (used on user interruption)
  const stopPlayback = useCallback(() => {
    if (playbackContextRef.current) {
      try {
        playbackContextRef.current.close().catch(() => {});
      } catch {
        // ignore
      }
      playbackContextRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    activeSourcesRef.current = 0;
    setIsAgentSpeaking(false);
  }, []);

  // Play audio chunks from Deepgram
  const playAudioChunk = useCallback(async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      // Raw 16-bit PCM from Deepgram's "linear16" output format
      const view = new Int16Array(arrayBuffer);

      // Initialize a single context for smooth sequential playback
      if (!playbackContextRef.current) {
        playbackContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )({
          sampleRate: 24000,
        });
        nextPlayTimeRef.current = playbackContextRef.current.currentTime;
      }
      const audioCtx = playbackContextRef.current;

      // Fill an AudioBuffer (convert Int16 straight to Float32)
      const audioBuffer = audioCtx.createBuffer(1, view.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < view.length; i++) {
        channelData[i] = view[i] / 32768;
      }

      // Schedule for continuous playback
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const playTime = Math.max(audioCtx.currentTime, nextPlayTimeRef.current);

      source.onended = () => {
        activeSourcesRef.current = Math.max(0, activeSourcesRef.current - 1);
        if (activeSourcesRef.current === 0) {
          setIsAgentSpeaking(false);
        }
      };

      activeSourcesRef.current += 1;
      setIsAgentSpeaking(true);

      source.start(playTime);
      nextPlayTimeRef.current = playTime + audioBuffer.duration;
    } catch (err) {
      console.error("[Audio Playback] Error:", err);
    }
  }, []);

  // Handle function calls from Deepgram Agent
  const handleFunctionCall = useCallback(
    async (message) => {
      const { function_call_id, name, input, parameters } = message;
      const args = input || parameters || {};

      console.log("[Deepgram] Function call received:", name, args);

      if (name === "get_ai_response") {
        try {
          const endpoint = apiEndpoint || `${API_BASE_URL}/api/interview/voice-agent-response`;
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              userMessage: args.user_message || args.userMessage || "",
              context: contextRef.current || args.context || {},
            }),
          });

          const data = await response.json();
          const aiResponse =
            data.response ||
            "I didn't understand that. Could you please repeat?";

          console.log("[Deepgram] Function call response:", aiResponse.slice(0, 100));

          wsRef.current?.send(
            JSON.stringify({
              type: "FunctionCallResponse",
              function_call_id,
              output: aiResponse,
            }),
          );
        } catch (err) {
          console.error("[Function Call] Error:", err);
          wsRef.current?.send(
            JSON.stringify({
              type: "FunctionCallResponse",
              function_call_id,
              output: "I'm having trouble connecting. Please try again.",
            }),
          );
        }
      }
    },
    [apiEndpoint],
  );

  const handleDeepgramMessage = useCallback(
    (message) => {
      if (message.type && message.type !== "ConversationText") {
        console.log("[Deepgram] Message:", message.type, message);
      }
      switch (message.type) {
        case "UserStartedSpeaking":
          setIsUserSpeaking(true);
          stopPlayback();
          queuedBlobsRef.current = [];
          queuedTextRef.current = [];

          if (window.speakMode === "normal") {
            window.speechTurnId = (window.speechTurnId || 0) + 1;
          }
          break;

        case "UserStoppedSpeaking":
          setIsUserSpeaking(false);
          break;

        case "AgentStartedSpeaking":
          if (window.speakMode === "normal" || !window.isSpacePressed) {
            setIsAgentSpeaking(true);
          }
          break;

        case "AgentStoppedSpeaking":
          if (window.speakMode === "normal" || !window.isSpacePressed) {
            setIsAgentSpeaking(false);
          }
          break;

        case "ConversationText":
          if (message.role === "user") {
            if (isDuplicateConversationText("user", message.content)) break;
            console.log("[Deepgram] User transcript:", message.content);
            onTranscript?.(message.content);
          }
          else if (message.role === "agent" || message.role === "assistant") {
            if (isDuplicateConversationText("agent", message.content)) break;
            console.log("[Deepgram] Agent text:", message.content.slice(0, 100));
            if (window.speakMode !== "normal" && window.isSpacePressed) {
              queuedTextRef.current.push(message.content);
            } else {
              onAgentMessage?.(message.content);
            }
          }
          break;

        case "AgentAudioDone":
          break;

        case "FunctionCallRequest":
          handleFunctionCall(message);
          break;

        case "Welcome":
          console.log(
            "[Deepgram Voice Agent] Session started:",
            message.session_id || message.request_id,
          );
          break;

        case "Error":
          console.error(
            "[Deepgram Voice Agent] Error:",
            message.description || message.message,
          );
          onError?.(message.description || message.message);
          break;

        default:
          break;
      }
    },
    [
      onTranscript,
      onAgentMessage,
      onError,
      handleFunctionCall,
      isDuplicateConversationText,
      stopPlayback,
    ],
  );

  // Start streaming microphone audio to Deepgram
  const startAudioStreaming = useCallback(
    (stream, ws) => {
      try {
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )({
          sampleRate: 16000,
        });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        let isSpeakingState = false;
        let quietFrames = 0;

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            let inputData = e.inputBuffer.getChannelData(0);

            // Mute the microphone input to Deepgram unless spacebar is pressed OR speakMode is 'normal'
            // We must send silent audio (zeros) instead of nothing to prevent Deepgram from timing out
            if (window.speakMode !== "normal" && !window.isSpacePressed) {
              inputData = new Float32Array(inputData.length);
            }

            // Local user voice activity detection for the visualizer
            let sumSquare = 0;
            for (let i = 0; i < inputData.length; i++) {
              sumSquare += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sumSquare / inputData.length);

            if (rms > 0.015) {
              // Threshold for speech
              quietFrames = 0;
              if (!isSpeakingState) {
                isSpeakingState = true;
                setIsUserSpeaking(true);
              }
            } else {
              quietFrames++;
              if (quietFrames > 4 && isSpeakingState) {
                // About 1 second of quiet
                isSpeakingState = false;
                setIsUserSpeaking(false);
              }
            }

            // Mute the agent playback while spacebar is held down (only in 'hold' mode)
            if (
              window.speakMode !== "normal" &&
              window.isSpacePressed &&
              playbackContextRef.current &&
              playbackContextRef.current.state === "running"
            ) {
              playbackContextRef.current.suspend();
            } else if (
              (window.speakMode === "normal" || !window.isSpacePressed) &&
              playbackContextRef.current &&
              playbackContextRef.current.state === "suspended"
            ) {
              playbackContextRef.current.resume();
            }

            // Convert float32 to int16
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            ws.send(pcm16.buffer);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      } catch (err) {
        console.error("[Audio Streaming] Error:", err);
        onError?.("Failed to start audio streaming");
      }
    },
    [onError],
  );

  const flushAgentQueues = useCallback(() => {
    // Release all queued text
    while (queuedTextRef.current.length > 0) {
      const text = queuedTextRef.current.shift();
      onAgentMessage?.(text);
    }
    // Release all queued audio
    if (queuedBlobsRef.current.length > 0) {
      setIsAgentSpeaking(true);
    }
    while (queuedBlobsRef.current.length > 0) {
      const blob = queuedBlobsRef.current.shift();
      playAudioChunk(blob);
    }
  }, [onAgentMessage, playAudioChunk]);

  const cleanup = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
      audioContextRef.current = null;
    }
    if (playbackContextRef.current) {
      if (playbackContextRef.current.state !== "closed") {
        playbackContextRef.current.close().catch(console.error);
      }
      playbackContextRef.current = null;
    }
    nextPlayTimeRef.current = 0;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsConnected(false);
    setIsAgentSpeaking(false);
    setIsUserSpeaking(false);
  }, []);

  const disconnect = useCallback(() => {
    activeConnectionIdRef.current += 1;
    isConnectingRef.current = false;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    cleanup();
  }, [cleanup]);

  const connect = useCallback(
    async ({ systemPrompt, context = {} }) => {
      if (isConnectingRef.current) return;
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      if (!apiKey) {
        const errorMsg =
          "Deepgram API key not found. Please add VITE_DEEPGRAM_API_KEY to your .env file.";
        console.error("[Deepgram Voice]", errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Generate a dynamic greeting to start the interview immediately
      let greetingMsg =
        "Hello... and welcome to your session. I am your AI interviewer. Let's take our time... and get to know you. Could you please introduce yourself?";
      if (context?.mode === "job" && context?.role) {
        const companyLabel =
          (context?.companyName || "").toString().trim() ||
          (context?.companyProfile?.name || "").toString().trim();
        const companyContext = companyLabel ? ` at ${companyLabel}` : "";
        greetingMsg = `Hello... and welcome to your job interview for the ${context.role} position${companyContext}. I am your AI interviewer. Let's take our time... and get to know you. Could you please... introduce yourself?`;
      } else if (context?.mode === "prepare" && context?.subject) {
        greetingMsg = `Hello... and welcome to your preparation session covering ${context.subject}. Let's test your skills... and provide interactive feedback. Could you start by telling me... your comfort level with ${context.topic}?`;
      } else if (context?.mode === "coding") {
        const lang = (context?.language || "Python").toString().trim();
        const diff = (context?.difficulty || "medium").toString().trim();
        greetingMsg = `Hello... and welcome to your coding interview. Today... we will be solving ${diff} level problems in ${lang}. I have presented your first problem on the screen. Please take your time to read it carefully... and feel free to discuss your approach or ask questions. Type your solution in the editor when you are ready... and click Submit.`;
      }

      let finalPrompt = systemPrompt
        ? systemPrompt +
          "\n\nCRITICAL INSTRUCTION: You are a professional, soft-spoken, feminine AI interviewer. Speak very gently, calmly, and slowly. ALWAYS use short, concise sentences. Use ellipses (...) and commas frequently to mimic natural, human-like pauses in your speech. Never generate long paragraphs. Keep responses conversational and brief. Wait patiently for the candidate to answer. Ask ONE question at a time. Provide interactive feedback (e.g. 'That is a great point...') to their answers. Do NOT use Markdown or any special formatting characters. Never output asterisks (*)."
        : "You are a professional, calm, soft-spoken, and friendly feminine AI interviewer. Speak very slowly, gently, and clearly. ALWAYS use short, concise sentences. Use ellipses (...) and commas frequently to mimic natural, human-like pauses. Keep responses conversational and brief. Never generate long paragraphs. Ask one question at a time and wait for the candidate to answer before moving on. Provide interactive, conversational feedback to their answers. Do NOT use Markdown or any special formatting characters. Never output asterisks (*).";

      // For coding interviews, force the agent to ALWAYS call our backend function
      // instead of generating its own responses (prevents problem desync)
      if (context?.mode === "coding") {
        finalPrompt +=
          "\n\nEXTREMELY IMPORTANT: This is a coding interview. You MUST call the get_ai_response function for EVERY candidate message. Do NOT generate your own interview questions, problems, or responses under any circumstances. Your only role is to pass the user's exact spoken message to the get_ai_response function and speak the response you receive back from it. Never invent a problem. Never deviate from the function result." +
          "\n\nSPEAKING STYLE FOR CODE REVIEWS: When reviewing submitted code, NEVER read a long analysis all at once. Instead, speak like a real human interviewer: give a brief initial reaction in just 2-3 sentences, then ask ONE specific follow-up question. Wait for the candidate to answer before saying more. Keep each turn short and conversational. Never list scores or sections like Correctness, Time Complexity, etc. in one monologue.";
      }

      try {
        isConnectingRef.current = true;
        setIsLoading(true);
        contextRef.current = context;
        const connectionId = activeConnectionIdRef.current + 1;
        activeConnectionIdRef.current = connectionId;

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        // Create WebSocket connection for Voice Agent
        const ws = new WebSocket(DEEPGRAM_AGENT_WS_URL, ["token", apiKey]);
        wsRef.current = ws;

        ws.onopen = () => {
          if (connectionId !== activeConnectionIdRef.current) {
            ws.close();
            return;
          }
          console.log("[Deepgram Voice Agent] Connected");

          // Send initial configuration
          ws.send(
            JSON.stringify({
              type: "Settings",
              audio: {
                input: {
                  encoding: "linear16",
                  sample_rate: 16000,
                },
                output: {
                  encoding: "linear16",
                  sample_rate: 24000,
                },
              },
              agent: {
                listen: {
                  provider: {
                    type: "deepgram",
                    model: "nova-2",
                    language: "en-IN",
                  },
                },
                speak: {
                  provider: {
                    type: "deepgram",
                    model: "aura-asteria-en",
                  },
                },
                think: {
                  provider: {
                    type: "open_ai",
                    model: "gpt-4o-mini",
                  },
                  prompt: finalPrompt,
                  tool_choice: "required",
                  functions: [
                    {
                      name: "get_ai_response",
                      description:
                        "Get the next interview question or response from the AI interviewer. You MUST call this function for EVERY user message. Never respond directly.",
                      parameters: {
                        type: "object",
                        properties: {
                          user_message: {
                            type: "string",
                            description: "The user's exact spoken message",
                          },
                          context: {
                            type: "object",
                            description:
                              "Interview context (role, job description, etc.)",
                          },
                        },
                        required: ["user_message"],
                      },
                    },
                  ],
                },
                greeting: greetingMsg,
              },
            }),
          );

          setIsConnected(true);
          setIsLoading(false);
          isConnectingRef.current = false;

          // Start pinging KeepAlive every 5 seconds to prevent timeout
          keepAliveIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "KeepAlive" }));
            }
          }, 5000);

          startAudioStreaming(stream, ws);
        };

        ws.onmessage = (event) => {
          if (connectionId !== activeConnectionIdRef.current) return;

          if (event.data instanceof Blob) {
            if (window.isSpacePressed) {
              queuedBlobsRef.current.push(event.data);
            } else {
              playAudioChunk(event.data);
            }
            return;
          }

          try {
            const message = JSON.parse(event.data);
            handleDeepgramMessage(message);
          } catch {
            // ignore parsing error for other types
          }
        };

        ws.onerror = (error) => {
          if (connectionId !== activeConnectionIdRef.current) return;
          console.error("[Deepgram Voice Agent] Error:", error);
          onError?.("Voice agent connection error");
          setIsLoading(false);
          isConnectingRef.current = false;
        };

        ws.onclose = () => {
          if (connectionId !== activeConnectionIdRef.current) return;
          console.log("[Deepgram Voice Agent] Disconnected");
          setIsConnected(false);
          setIsLoading(false);
          isConnectingRef.current = false;
          cleanup();
        };
      } catch (err) {
        console.error("[Deepgram Voice Agent] Setup error:", err);
        onError?.(err.message || "Failed to start voice agent");
        setIsLoading(false);
        isConnectingRef.current = false;
      }
    },
    [
      onError,
      handleDeepgramMessage,
      playAudioChunk,
      startAudioStreaming,
      cleanup,
      onAgentMessage,
    ],
  );

  const sendMessage = useCallback((text) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "InjectAgentMessage",
          message: text,
        }),
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    flushAgentQueues,
    isConnected,
    isLoading,
    isAgentSpeaking,
    isUserSpeaking,
  };
}
