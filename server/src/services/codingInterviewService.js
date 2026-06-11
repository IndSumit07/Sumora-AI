import { ChatGroq } from "@langchain/groq";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { CONFIG } from "../configs/app.config.js";

// ── In-memory registries ──────────────────────────────────────────────────────
const messageHistories = new Map();
const activeChains = new Map();

// ── Language templates ───────────────────────────────────────────────────────

const LANGUAGE_TEMPLATES = {
  python: `class Solution:
    def solve(self, ...):
        # Write your solution here
        pass`,
  java: `class Solution {
    public int solve(...) {
        // Write your solution here
        return 0;
    }
}`,
  cpp: `class Solution {
public:
    int solve(...) {
        // Write your solution here
        return 0;
    }
};`,
  javascript: `class Solution {
    solve(...) {
        // Write your solution here
        return 0;
    }
}`,
  typescript: `class Solution {
    solve(...): number {
        // Write your solution here
        return 0;
    }
}`,
  go: `func solve(...) int {
    // Write your solution here
    return 0
}`,
  rust: `impl Solution {
    pub fn solve(...) -> i32 {
        // Write your solution here
        0
    }
}`,
  csharp: `public class Solution {
    public int Solve(...) {
        // Write your solution here
        return 0;
    }
}`,
};

// ── System prompt for coding interview ───────────────────────────────────────

const CODING_SYSTEM_TEMPLATE = `You are a professional technical interviewer conducting a live coding interview for a software engineering role.

YOUR RULES — NEVER VIOLATE THESE:
1. You will present ONE coding problem at a time. After the candidate submits code, you analyze it.
2. Your first message MUST contain:
   - A warm greeting
   - The problem statement clearly formatted
   - A starter code template for the selected language
   - 2-3 example inputs/outputs
   - Constraints (time/space complexity expectations)
3. When the candidate submits code, first analyze:
   - Correctness (does it solve the problem?)
   - Time complexity
   - Space complexity
   - Code quality (readability, naming, edge cases)
   - Suggest improvements if any
   Then ask at least ONE follow-up question about their solution, such as:
   - "What is the time complexity of your approach?"
   - "Can you walk me through your logic?"
   - "Did you consider edge cases like empty input?"
   - "Is there a more optimal approach?"
   Have a brief back-and-forth conversation before offering to move on.
4. Only move to a new problem when the candidate explicitly asks for the next problem or confirms they are ready. Do NOT rush to the next problem.
5. If the solution is incorrect, guide the candidate with hints — do NOT give the full answer immediately.
6. Be concise. Do NOT use Markdown formatting in your responses.
7. Never output asterisks (*) in any response.
8. Always address the candidate professionally.

Interview Difficulty: {difficulty}
Programming Language: {language}

Problem Generation Guidelines:
- EASY: Standard array/string problems, basic recursion, simple hash map usage. LeetCode Easy level.
- MEDIUM: Two-pointer, sliding window, tree/graph traversal, DP with memoization. LeetCode Medium level.
- HARD: Advanced DP, graph algorithms (Dijkstra, topological sort), segment trees, hard greedy. LeetCode Hard level.

When presenting the problem, format it as:
---PROBLEM---
[problem statement]
---EXAMPLES---
[examples]
---CONSTRAINTS---
[constraints]
---STARTER_CODE---
[starter code for the selected language]`;

// ── Code analysis prompt (one-shot) ──────────────────────────────────────────

const CODE_ANALYSIS_TEMPLATE = `You are an expert code reviewer evaluating a candidate's solution during a coding interview.

Problem:
{problemStatement}

Candidate's Code ({language}):
{code}

Provide a structured evaluation. Respond with ONLY valid JSON — no markdown, no extra text.

{
  "correctness": "correct|partially_correct|incorrect",
  "correctnessScore": <integer 0-10>,
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "timeComplexityScore": <integer 0-10>,
  "spaceComplexityScore": <integer 0-10>,
  "codeQualityScore": <integer 0-10>,
  "edgeCasesScore": <integer 0-10>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."],
  "hints": ["..."],
  "nextQuestion": "follow-up question or empty string if no follow-up",
  "overallScore": <integer 0-100>
}`;

// ── Feedback generation prompt ───────────────────────────────────────────────

const FEEDBACK_TEMPLATE = `You are evaluating a candidate's overall performance across multiple coding problems.

Review the conversation and code submissions. Provide structured feedback.
Respond with ONLY valid JSON — no markdown, no extra text.

{
  "technicalScore": <integer 0-10>,
  "problemSolvingScore": <integer 0-10>,
  "codeQualityScore": <integer 0-10>,
  "complexityAnalysisScore": <integer 0-10>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."],
  "problemBreakdown": [
    {
      "problem": "...",
      "correctness": "correct|partially_correct|incorrect",
      "timeComplexity": "...",
      "spaceComplexity": "...",
      "feedback": "..."
    }
  ],
  "overallScore": <integer 0-100>
}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLLM() {
  return new ChatGroq({
    model: CONFIG.ai.GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxRetries: CONFIG.ai.MAX_RETRIES,
  });
}

function extractContent(response) {
  if (typeof response?.content === "string") return response.content.trim();
  if (typeof response === "string") return response.trim();
  return String(response).trim();
}

function parseModelJson(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  if (start < 0) return null;
  let candidate = cleaned.slice(start);
  const lastClose = candidate.lastIndexOf("}");
  if (lastClose >= 0) candidate = candidate.slice(0, lastClose + 1);
  else candidate = `${candidate}}`;
  candidate = candidate.replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

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

function makeSystemPrompt(difficulty, language) {
  return CODING_SYSTEM_TEMPLATE.replace("{difficulty}", difficulty).replace(
    "{language}",
    language,
  );
}

export function getStarterCode(language) {
  return LANGUAGE_TEMPLATES[language] || LANGUAGE_TEMPLATES.python;
}

export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_TEMPLATES);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function initCodingInterview(
  interviewId,
  difficulty = "medium",
  language = "python",
) {
  const systemPrompt = makeSystemPrompt(difficulty, language);
  const chainWithHistory = buildChain(interviewId, systemPrompt);
  const idStr = interviewId.toString();
  const response = await chainWithHistory.invoke(
    {
      input: `Please present the first coding problem for a ${difficulty} level interview in ${language}. Include the starter code template for ${language}.`,
    },
    { configurable: { sessionId: idStr } },
  );
  return extractContent(response);
}

export async function sendCodeSubmission(
  interviewId,
  code,
  language,
  problemStatement,
) {
  const chain = activeChains.get(interviewId.toString());
  if (!chain) throw new Error("Coding interview session not found in memory.");

  const input = `The candidate has submitted their solution in ${language}.

Problem:\n${problemStatement}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease analyze this code for correctness, time/space complexity, code quality, and edge case handling. Be thorough but concise.`;

  const response = await chain.invoke(
    { input },
    { configurable: { sessionId: interviewId.toString() } },
  );
  return extractContent(response);
}

export async function sendMessage(interviewId, message) {
  const chain = activeChains.get(interviewId.toString());
  if (!chain) throw new Error("Coding interview session not found in memory.");

  const response = await chain.invoke(
    { input: message },
    { configurable: { sessionId: interviewId.toString() } },
  );
  return extractContent(response);
}

export async function analyzeCode(problemStatement, code, language) {
  const llm = buildLLM();
  const prompt = CODE_ANALYSIS_TEMPLATE.replace("{problemStatement}", problemStatement)
    .replace("{code}", code)
    .replace("{language}", language);
  const response = await llm.invoke([new HumanMessage(prompt)]);
  const raw =
    typeof response?.content === "string"
      ? response.content
      : JSON.stringify(response);
  return parseModelJson(raw);
}

export async function generateFeedback(conversation, codeSubmissions) {
  const llm = buildLLM();
  const transcript = conversation
    .map((t) => `${t.role}: ${t.text}`)
    .join("\n\n");
  const submissions = codeSubmissions
    .map((s) => `[${s.language}]\n${s.code}`)
    .join("\n\n---\n\n");

  const prompt = `${FEEDBACK_TEMPLATE}\n\nConversation:\n${transcript}\n\nCode Submissions:\n${submissions}`;
  const response = await llm.invoke([new HumanMessage(prompt)]);
  const raw =
    typeof response?.content === "string"
      ? response.content
      : JSON.stringify(response);
  return parseModelJson(raw);
}

export async function recoverChain(interview, difficulty, language) {
  const idStr = interview._id.toString();
  const systemPrompt = makeSystemPrompt(
    difficulty || interview.difficulty || "medium",
    language || interview.language || "python",
  );
  const hist = new InMemoryChatMessageHistory();
  const messages = [
    new HumanMessage(
      `Please present the first coding problem for a ${difficulty || interview.difficulty || "medium"} level interview in ${language || interview.language || "python"}.`,
    ),
  ];
  for (const turn of interview.conversation) {
    if (turn.role === "agent") messages.push(new AIMessage(turn.text));
    else messages.push(new HumanMessage(turn.text));
  }
  await hist.addMessages(messages);
  messageHistories.set(idStr, hist);
  buildChain(idStr, systemPrompt);
}

export function cleanupChain(interviewId) {
  const idStr = interviewId.toString();
  activeChains.delete(idStr);
  messageHistories.delete(idStr);
}
