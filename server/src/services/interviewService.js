/**
 * interviewService.js
 *
 * LangChain v1.x + Groq live interview service using LCEL
 * (RunnableWithMessageHistory — the modern replacement for ConversationChain
 *  + BufferMemory, with identical semantics).
 *
 * Exports:
 *   initInterview(interviewId, resume, role, jobDescription) → firstQuestion (string)
 *   sendAnswer(interviewId, answer)                         → nextQuestion (string)
 *   recoverChain(interview)                                 → void (rebuilds in-memory state)
 *   generateFeedback(conversation)                          → structured feedback object
 *   cleanupChain(interviewId)                               → void
 */

import { ChatGroq } from "@langchain/groq";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// ── In-memory registries ──────────────────────────────────────────────────────
// Map<interviewId, InMemoryChatMessageHistory>
const messageHistories = new Map();
// Map<interviewId, RunnableWithMessageHistory>
const activeChains = new Map();

// ── Interview system prompt template ──────────────────────────────────────────
const SYSTEM_TEMPLATE = `You are a professional technical interviewer conducting a real job interview.
Interview the candidate based on their resume and the job description below.

Rules you must follow at all times:
- Ask EXACTLY one question per turn — never multiple questions at once.
- If the candidate's answer is vague or weak, ask a targeted follow-up before moving on.
- Gradually increase the difficulty of questions throughout the interview.
- Focus on skills and experiences mentioned in the resume or required by the job description.
- Be concise, professional, and neutral in tone.
- Output ONLY the question text — no preamble, no labels, no additional commentary.

Resume:
{resume}

Target Role: {role}

Job Description:
{jobDescription}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLLM() {
  return new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxRetries: 2,
  });
}

function extractContent(response) {
  if (typeof response?.content === "string") return response.content.trim();
  if (typeof response === "string") return response.trim();
  return String(response).trim();
}

/**
 * Build (or rebuild) a RunnableWithMessageHistory chain for the given
 * interviewId and system prompt string. Registers both the history and the
 * chain in the in-memory maps.
 */
function buildChain(interviewId, systemPrompt) {
  const llm = buildLLM();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const base = prompt.pipe(llm);

  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: base,
    getMessageHistory: (sid) => {
      if (!messageHistories.has(sid)) {
        messageHistories.set(sid, new InMemoryChatMessageHistory());
      }
      return messageHistories.get(sid);
    },
    inputMessagesKey: "input",
    historyMessagesKey: "history",
  });

  activeChains.set(interviewId, chainWithHistory);
  return chainWithHistory;
}

function makeSystemPrompt(resume, role, jobDescription) {
  return SYSTEM_TEMPLATE.replace("{resume}", resume || "No resume provided.")
    .replace("{role}", role || "Software Engineer")
    .replace("{jobDescription}", jobDescription || "Not specified.");
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialise a new interview chain and return the first question.
 *
 * @param {string} interviewId     — DB _id used as history session key
 * @param {string} resume          — extracted resume text (may be empty)
 * @param {string} role            — target job role
 * @param {string} jobDescription  — full job description
 * @returns {Promise<string>}        first question from the AI
 */
export async function initInterview(interviewId, resume, role, jobDescription) {
  const systemPrompt = makeSystemPrompt(resume, role, jobDescription);
  const chainWithHistory = buildChain(interviewId, systemPrompt);

  const idStr = interviewId.toString();
  const response = await chainWithHistory.invoke(
    { input: "Please begin the interview and ask your first question." },
    { configurable: { sessionId: idStr } },
  );

  return extractContent(response);
}

/**
 * Submit the candidate's answer and receive the next AI question.
 *
 * @param {string} interviewId
 * @param {string} answer
 * @returns {Promise<string>} next question
 */
export async function sendAnswer(interviewId, answer) {
  const chain = activeChains.get(interviewId.toString());
  if (!chain) throw new Error("Interview session not found in memory.");

  const response = await chain.invoke(
    { input: answer },
    { configurable: { sessionId: interviewId.toString() } },
  );

  return extractContent(response);
}

/**
 * Rebuild the in-memory chain from a persisted LiveInterview document.
 * Called automatically when the chain is missing (e.g. after a server restart).
 *
 * @param {object} interview — LiveInterview Mongoose document
 */
export async function recoverChain(interview) {
  const idStr = interview._id.toString();
  const systemPrompt = makeSystemPrompt(
    interview.resumeText,
    interview.role,
    interview.jobDescription,
  );

  // Reconstruct the history from the stored conversation
  const hist = new InMemoryChatMessageHistory();
  const messages = [
    new HumanMessage("Please begin the interview and ask your first question."),
  ];

  for (const turn of interview.conversation) {
    if (turn.question) messages.push(new AIMessage(turn.question));
    if (turn.answer) messages.push(new HumanMessage(turn.answer));
  }

  await hist.addMessages(messages);
  messageHistories.set(idStr, hist);
  buildChain(idStr, systemPrompt);
}

/**
 * Remove a finished interview's chain from memory to free resources.
 * @param {string} interviewId
 */
export function cleanupChain(interviewId) {
  const idStr = interviewId.toString();
  activeChains.delete(idStr);
  messageHistories.delete(idStr);
}

/**
 * Generate structured feedback for a completed interview using a one-shot
 * direct LLM call (bypasses the conversation chain intentionally).
 *
 * @param {Array<{ question: string, answer: string }>} conversation
 * @returns {Promise<{ technicalScore, communicationScore, strengths, weaknesses, improvements }>}
 */
export async function generateFeedback(conversation) {
  const llm = buildLLM();

  const transcript = conversation
    .filter((t) => t.answer && t.answer.trim())
    .map((t, i) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}`)
    .join("\n\n");

  const promptText = `You are an expert technical interviewer evaluating a candidate's overall performance.

Interview transcript:
${transcript || "No answers were recorded."}

Produce a structured performance evaluation.
Respond with ONLY valid JSON — no markdown, no code fences, no extra text before or after.

{
  "technicalScore": <integer 0-10>,
  "communicationScore": <integer 0-10>,
  "strengths": ["<specific strength>"],
  "weaknesses": ["<specific weakness>"],
  "improvements": ["<actionable improvement suggestion>"]
}`;

  const response = await llm.invoke([new HumanMessage(promptText)]);
  const raw =
    typeof response?.content === "string"
      ? response.content
      : JSON.stringify(response);

  // Strip markdown code fences if the model wrapped the JSON
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Model returned non-JSON feedback.");

  const parsed = JSON.parse(match[0]);

  return {
    technicalScore: Math.min(
      10,
      Math.max(0, Number(parsed.technicalScore) || 0),
    ),
    communicationScore: Math.min(
      10,
      Math.max(0, Number(parsed.communicationScore) || 0),
    ),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
  };
}
