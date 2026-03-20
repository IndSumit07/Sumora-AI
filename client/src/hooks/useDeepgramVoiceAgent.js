import { useState, useRef, useCallback, useEffect } from "react";

const DEEPGRAM_AGENT_WS_URL = "wss://agent.deepgram.com/v1/agent/converse";

export function useDeepgramVoiceAgent({
  onTranscript,
  onAgentMessage,
  onError,
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

  const playbackContextRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const activeSourcesRef = useRef(0);

  // Queue to hold Agent responses while spacebar is held
  const queuedBlobsRef = useRef([]);
  const queuedTextRef = useRef([]);

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
          sampleRate: 48000,
        });
        nextPlayTimeRef.current = playbackContextRef.current.currentTime;
      }
      const audioCtx = playbackContextRef.current;

      // Fill an AudioBuffer (convert Int16 straight to Float32)
      const audioBuffer = audioCtx.createBuffer(1, view.length, 48000);
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
      const { function_call_id, function_name, input } = message;

      if (function_name === "get_ai_response") {
        try {
          // Call our backend to get AI response
          const response = await fetch("/api/interview/voice-agent-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              userMessage: input.user_message,
              context: contextRef.current || input.context || {},
            }),
          });

          const data = await response.json();
          const aiResponse =
            data.response ||
            "I didn't understand that. Could you please repeat?";

          // Display the agent's response on the UI since we generated it locally
          onAgentMessage?.(aiResponse);

          // Send function result back to Deepgram
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
    [onAgentMessage],
  );

  // Handle messages from Deepgram
  const handleDeepgramMessage = useCallback(
    (message) => {
      switch (message.type) {
        case "UserStartedSpeaking":
          setIsUserSpeaking(true);
          // If the user interrupted the agent, wipe out any queued responses
          queuedBlobsRef.current = [];
          queuedTextRef.current = [];
          break;

        case "UserStoppedSpeaking":
          setIsUserSpeaking(false);
          break;

        case "AgentStartedSpeaking":
          if (!window.isSpacePressed) {
            setIsAgentSpeaking(true);
          }
          break;

        case "AgentStoppedSpeaking":
          if (!window.isSpacePressed) {
            setIsAgentSpeaking(false);
          }
          break;

        case "ConversationText":
          // User's transcribed speech
          if (message.role === "user") {
            onTranscript?.(message.content);
          }
          // Agent's text response
          else if (message.role === "agent" || message.role === "assistant") {
            if (window.isSpacePressed) {
              queuedTextRef.current.push(message.content);
            } else {
              onAgentMessage?.(message.content);
            }
          }
          break;

        case "AgentAudioDone":
          // Sometimes Deepgram sends the final agent text here
          break;

        case "FunctionCallRequest":
          // Agent wants to call our backend function
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
          // Ignore unhandled message types
          break;
      }
    },
    [onTranscript, onAgentMessage, onError, handleFunctionCall],
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

            // Mute the microphone input to Deepgram unless spacebar is pressed
            // We must send silent audio (zeros) instead of nothing to prevent Deepgram from timing out
            if (!window.isSpacePressed) {
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

            // Mute the agent playback while spacebar is held down
            if (
              window.isSpacePressed &&
              playbackContextRef.current &&
              playbackContextRef.current.state === "running"
            ) {
              playbackContextRef.current.suspend();
            } else if (
              !window.isSpacePressed &&
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
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    cleanup();
  }, [cleanup]);

  const connect = useCallback(
    async ({ systemPrompt, context = {} }) => {
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
        greetingMsg = `Hello... and welcome to your job interview for the ${context.role} position. I am your AI interviewer. Let's take our time... and get to know you. Could you please... introduce yourself?`;
      } else if (context?.mode === "prepare" && context?.subject) {
        greetingMsg = `Hello... and welcome to your preparation session covering ${context.subject}. Let's test your skills... and provide interactive feedback. Could you start by telling me... your comfort level with ${context.topic}?`;
      }

      const finalPrompt = systemPrompt
        ? systemPrompt +
          "\n\nCRITICAL INSTRUCTION: You are a professional, soft-spoken, feminine AI interviewer. Speak very gently, calmly, and slowly. ALWAYS use short, concise sentences. Use ellipses (...) and commas frequently to mimic natural, human-like pauses in your speech. Never generate long paragraphs. Keep responses conversational and brief. Wait patiently for the candidate to answer. Ask ONE question at a time. Provide interactive feedback (e.g. 'That is a great point...') to their answers."
        : "You are a professional, calm, soft-spoken, and friendly feminine AI interviewer. Speak very slowly, gently, and clearly. ALWAYS use short, concise sentences. Use ellipses (...) and commas frequently to mimic natural, human-like pauses. Keep responses conversational and brief. Never generate long paragraphs. Ask one question at a time and wait for the candidate to answer before moving on. Provide interactive, conversational feedback to their answers.";

      try {
        setIsLoading(true);
        contextRef.current = context;

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        // Create WebSocket connection for Voice Agent
        const ws = new WebSocket(DEEPGRAM_AGENT_WS_URL, ["token", apiKey]);
        wsRef.current = ws;

        ws.onopen = () => {
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
                  sample_rate: 48000,
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
                    model: "aura-luna-en",
                  },
                },
                think: {
                  provider: {
                    type: "google",
                    model: "gemini-2.5-flash",
                  },
                  prompt: finalPrompt,
                  functions: [
                    {
                      name: "get_ai_response",
                      description:
                        "Get the next interview question or response from the AI interviewer",
                      parameters: {
                        type: "object",
                        properties: {
                          user_message: {
                            type: "string",
                            description: "The user's answer or message",
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

          // Start pinging KeepAlive every 5 seconds to prevent timeout
          keepAliveIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "KeepAlive" }));
            }
          }, 5000);

          // Post the greeting message to the UI instantly so the user sees it
          onAgentMessage?.(greetingMsg.replace(/\.\.\./g, ""));

          startAudioStreaming(stream, ws);
        };

        ws.onmessage = (event) => {
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
          console.error("[Deepgram Voice Agent] Error:", error);
          onError?.("Voice agent connection error");
          setIsLoading(false);
        };

        ws.onclose = () => {
          console.log("[Deepgram Voice Agent] Disconnected");
          setIsConnected(false);
          setIsLoading(false);
          cleanup();
        };
      } catch (err) {
        console.error("[Deepgram Voice Agent] Setup error:", err);
        onError?.(err.message || "Failed to start voice agent");
        setIsLoading(false);
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
