# Sumora AI - AI Workflow and Models Documentation

This document explains only the AI system in Sumora AI: models, orchestration, prompts, data flow, token consumption points, and how each AI endpoint works.

## 1. AI System Overview

Sumora AI uses multiple model providers for different tasks:

- Google Gemini (`gemini-2.5-flash`) for structured report generation and resume HTML generation.
- Groq via LangChain (`llama-3.1-8b-instant`) for live interview conversations, follow-up questioning, question analysis, and end-of-interview feedback generation.
- Deepgram for voice agent streaming and text-to-speech in the live voice interview flow.

The backend orchestrates all AI calls. The frontend never directly calls LLM APIs for core interview/report decisions.

## 2. Model-to-Task Mapping

### 2.1 Gemini Tasks (`server/src/services/ai.service.js`)

Model:
- `gemini-2.5-flash`

Used for:
- Interview report generation (`generateInterviewReport`)
- Resume HTML generation for PDF (`generateResumePdf`)

Output strategy:
- Uses JSON schema-constrained output with Zod schema conversion.
- `responseMimeType: application/json`
- Response parsed and validated as strict structured JSON.

Why Gemini here:
- Reliable structured JSON generation for long, multi-field outputs.
- Better fit for deterministic schema-based report objects.

### 2.2 Groq + LangChain Tasks (`server/src/services/interviewService.js`)

Model:
- `llama-3.1-8b-instant` via `ChatGroq`

Used for:
- Live job interview questioning loop.
- Prepare-mode topic-locked interview loop.
- Question analysis/teaching response (`analyzeQuestion`).
- Final interview feedback object (`generateFeedback`).

Orchestration strategy:
- `RunnableWithMessageHistory` + `InMemoryChatMessageHistory`
- One in-memory chain per `interviewId`.
- Chains can be rebuilt from database transcript after server restart (`recoverChain`).

Why Groq here:
- Low-latency conversational turn generation.
- Strong fit for iterative back-and-forth interview flow.

### 2.3 Deepgram Tasks (Client Hooks + Backend Voice Handler)

Frontend files:
- `client/src/hooks/useDeepgramVoiceAgent.js`
- `client/src/hooks/useDeepgramTTS.js`

Backend route:
- `POST /api/interview/voice-agent-response`

Used for:
- Real-time microphone streaming and agent audio playback.
- Function-call driven agent response through backend interview chain.
- TTS synthesis of agent output.

## 3. End-to-End AI Workflows

### 3.1 AI Interview Report Workflow

Entry point:
- `POST /api/interview/`
- Controller: `generateInterViewReportController`

Flow:
1. Validate inputs (`jobDescription` required, optional resume PDF).
2. Check user token balance (`REPORT_GENERATION` cost = 25).
3. If resume exists, extract text from PDF.
4. Call `generateInterviewReport` (Gemini).
5. Gemini returns strict JSON with:
   - `matchScore`
   - `technicalQuestions[]`
   - `behavioralQuestions[]`
   - `skillGaps[]`
   - `preparationPlan[]`
   - `title`
6. Persist as `InterviewReport` in MongoDB.
7. Deduct tokens and return report + `tokensLeft`.

Prompt design notes:
- Explicitly forces exactly 10 technical and 10 behavioral questions.
- Includes resume/self-description/job description context.

### 3.2 Resume PDF Generation Workflow

Entry point:
- `POST /api/interview/resume/pdf/:interviewReportId`
- Controller: `generateResumePdfController`

Flow:
1. Fetch stored interview report context.
2. Call `generateResumePdf` (Gemini) to produce concise ATS-friendly HTML.
3. Render HTML to PDF with Puppeteer.
4. Stream PDF buffer as downloadable response.

Model behavior:
- Gemini returns JSON `{ html: "..." }`.
- Server converts HTML to A4 PDF (`--no-sandbox` launch args).

### 3.3 Live Interview (Job Mode) Workflow

Entry points:
- `POST /api/interview/start`
- `POST /api/interview/answer`
- `POST /api/interview/end`

Start flow (`startInterviewController`):
1. Validate role + job description.
2. Check tokens (`LIVE_INTERVIEW` cost = 20).
3. Create `LiveInterview` document.
4. Initialize chain via `initInterview`.
5. Generate first question from Groq chain.
6. Save question in conversation array.
7. Deduct tokens.

Answer flow (`answerInterviewController`):
1. Validate interview ownership/status.
2. Recover in-memory chain if missing (`recoverChain`).
3. Save user answer in last conversation turn.
4. Send answer to chain (`sendAnswer`) for next question.
5. Append new AI question turn and persist.

End flow (`endInterviewController`):
1. Generate structured feedback from full transcript (`generateFeedback`).
2. Compute overall score:
   - `overall = technicalScore * 6 + communicationScore * 4` (0-100)
3. Mark interview completed.
4. Cleanup in-memory chain (`cleanupChain`).

### 3.4 Prepare Mode Workflow (Topic-Locked)

Entry points:
- `POST /api/interview/prepare/start`
- `POST /api/interview/answer`
- `POST /api/interview/end`

Prepare start differences:
- Uses `initPrepareInterview` with strict topic lock system prompt.
- Cost = `PREPARE_INTERVIEW` (20 tokens).
- System prompt enforces one-question-per-turn and no off-topic drift.

### 3.5 Analyze Question Workflow

Entry point:
- `POST /api/interview/analyze-question`
- Controller: `analyzeQuestionController`

Flow:
1. Validate `interviewId` and `questionIndex`.
2. Fetch target question + user answer from stored conversation.
3. Call `analyzeQuestion` (Groq).
4. Return structured teaching JSON:
   - `why`
   - `structure[]`
   - `sampleAnswer`
   - `tip`

### 3.6 Voice Interview Workflow

Entry points:
- Frontend Deepgram WS session.
- Backend: `POST /api/interview/voice-agent-response`.

Flow:
1. Client captures microphone audio and streams to Deepgram agent.
2. Deepgram function call requests app-level response.
3. Backend `voiceAgentResponseController`:
   - validates user + interview
   - recovers chain if needed
   - pushes user utterance to transcript
   - calls `sendAnswer` for next question
   - persists updated conversation
4. Client receives/plays agent speech (Deepgram audio).

Special handling:
- `[START]` trigger can bootstrap first AI turn for voice sessions.

## 4. Prompt and Control Logic

### 4.1 Job Interview Prompt Controls

System constraints include:
- Exactly one question per turn.
- Ask follow-up if answer is weak.
- Increase difficulty gradually.
- Ask only question text (no acknowledgments like "Got it").

Difficulty modifiers:
- `easy`: beginner-focused, lighter probing.
- `medium`: balanced fundamentals + applied scenarios.
- `hard`: advanced deep probing with edge cases and internals.

### 4.2 Prepare Prompt Controls

Prepare system prompt has hard rules:
- Topic lock to specified subject/topic.
- One question per response, strict.
- No filler acknowledgments.
- No teaching unless user asks for hint explicitly.
- Off-topic redirection behavior.
- Difficulty arc over question progression.

### 4.3 Structured Output Reliability

Current safeguards:
- Gemini: JSON schema constraints from Zod.
- Groq: JSON-extraction and cleanup fallback for malformed blocks.
- `safeJsonParse` attempts to repair invalid escape sequences.
- Fallback objects returned when JSON parsing fails.

## 5. AI Session State and Persistence

In-memory state:
- `activeChains: Map<interviewId, RunnableWithMessageHistory>`
- `messageHistories: Map<interviewId, InMemoryChatMessageHistory>`

Persistent state:
- `LiveInterview.conversation[]` stores every AI question/user answer turn.

Recovery strategy:
- If server restarts and memory is lost, `recoverChain(interview)` rebuilds state from MongoDB transcript and context fields.

Cleanup strategy:
- `cleanupChain(interviewId)` on interview completion/deletion.

## 6. AI Data Contracts

### 6.1 Interview Report Object (Gemini)

Fields:
- `title: string`
- `matchScore: number (0-100)`
- `technicalQuestions[]: { question, intention, answer }`
- `behavioralQuestions[]: { question, intention, answer }`
- `skillGaps[]: { skill, severity(low|medium|high) }`
- `preparationPlan[]: { day, focus, tasks[] }`

### 6.2 End Feedback Object (Groq)

Fields:
- `technicalScore: integer 0-10`
- `communicationScore: integer 0-10`
- `strengths[]`
- `weaknesses[]`
- `improvements[]`

Stored as serialized JSON in `LiveInterview.feedback`.

### 6.3 Question Analysis Object (Groq)

Fields:
- `why`
- `structure[]`
- `sampleAnswer`
- `tip`

## 7. Cost and Token Enforcement (AI-Relevant)

Token checks happen before expensive AI actions:
- Report generation: 25
- Live interview start: 20
- Prepare interview start: 20

If insufficient:
- API returns HTTP 402 with appropriate message.

Token deduction occurs after successful start/generation events.

## 8. AI-Related Environment Variables

Server:
- `GOOGLE_API_KEY` (Gemini)
- `GROQ_API_KEY` (Groq via LangChain)

Client:
- `VITE_DEEPGRAM_API_KEY` (Deepgram WS/TTS)

Supporting auth/payment envs exist but are outside core AI inference paths.

## 9. Failure Modes and Current Mitigations

Malformed model JSON:
- Clean + regex extraction + fallback default objects.

Server restart during interview:
- Reconstruct chain from stored conversation with `recoverChain`.

Voice endpoint context errors:
- Strict validation on `interviewId` and user ownership.

Provider/network errors:
- Caught and surfaced as `500`/specific messages.

## 10. AI Workflow Sequence Summary

### Report path
Input context -> Gemini structured generation -> Mongo persist -> token deduction -> response

### Live interview path
Start -> create interview doc -> build chain -> first question -> iterative answer/question loop -> feedback generation -> score -> cleanup

### Voice path
Mic stream -> Deepgram agent -> backend function call -> Groq chain response -> Deepgram playback -> transcript persistence

## 11. Files to Read for AI Internals

Core files:
- `server/src/services/ai.service.js`
- `server/src/services/interviewService.js`
- `server/src/controllers/interview.controller.js`
- `server/src/controllers/liveInterview.controller.js`
- `client/src/hooks/useDeepgramVoiceAgent.js`
- `client/src/hooks/useDeepgramTTS.js`

Related models:
- `server/src/models/interviewReport.model.js`
- `server/src/models/liveInterview.model.js`
- `server/src/models/user.model.js`

---

If needed, the next step is generating a dedicated `AI_API_EXAMPLES.md` with request/response examples for every AI endpoint (`/interview/*` + voice flow) and expected error payloads.
