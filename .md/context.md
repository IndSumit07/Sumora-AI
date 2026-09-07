# Sumora AI — Complete Codebase Context

> **Project:** Sumora AI — AI-powered career preparation platform
> **Live:** [sumora.ai](https://sumora.ai)
> **Author:** Sumit Kumar — Full-stack Engineer

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Directory Structure](#3-directory-structure)
4. [Server — Entry & Config](#4-server--entry--config)
5. [Server — Models](#5-server--models)
6. [Server — Middlewares](#6-server--middlewares)
7. [Server — Routes](#7-server--routes)
8. [Server — Controllers](#8-server--controllers)
9. [Server — Services](#9-server--services)
10. [Client — Entry & Config](#10-client--entry--config)
11. [Client — Context Providers](#11-client--context-providers)
12. [Client — Hooks](#12-client-hooks)
13. [Client — Lib Utilities](#13-client-lib-utilities)
14. [Client — Shared Data](#14-client-shared-data)
15. [Client — Pages](#15-client-pages)
16. [Client — Components](#16-client-components)
17. [Public Assets](#17-public-assets)
18. [CI/CD](#18-cicd)
19. [AI System Summary](#19-ai-system-summary)
20. [API Endpoints](#20-api-endpoints)
21. [Environment Variables](#21-environment-variables)

---

## 1. Project Overview

Sumora AI is a token-based AI career preparation platform with four core services:

| Service | Token Cost | Description |
|---|---|---|
| AI Mock Interview | 20 tokens | Live 1-on-1 voice interview with AI interviewer |
| Interview Preparation | 20 tokens | Topic-locked Q&A drill sessions |
| Resume Analysis | 25 tokens | ATS scoring, keyword gap analysis, section feedback |
| Coding Interview | 35 tokens | Live coding problem solving with AI review |
| Performance Stats | Free | Score trends, session history, progress tracking |

**Supported Companies:** 40 total (23 India + 17 Global)

---

## 2. Tech Stack Summary

### Frontend
- **React 19.2** — UI framework
- **Vite 8.0** — Build tool & dev server
- **Tailwind CSS 3.4** — Utility-first styling
- **React Router 7.13** — Client-side routing
- **Framer Motion 12.38** — Animations
- **Axios 1.13** — HTTP client
- **Three.js 0.183** — 3D hero scene
- **@paper-design/shaders 0.0.72** — WebGL background shaders
- **Monaco Editor** — Code editor for coding interviews
- **Lenis 1.3** — Smooth scrolling
- **GSAP 3.15** — Animations
- **Radix UI** — Accessible UI primitives
- **React Hot Toast 2.6** — Notifications
- **Cloudflare Turnstile** — Bot protection
- **Google OAuth 0.13** — Social login
- **Vercel Analytics 2.0** — Page analytics

### Backend
- **Node.js (ESM) 20+** — Runtime
- **Express 5.2** — API server
- **MongoDB + Mongoose 9.3** — Database
- **jsonwebtoken 9.0** — Auth
- **bcryptjs 3.0** — Password hashing
- **Helmet 8.1** — Security headers
- **express-rate-limit 8.3** — Rate limiting (Redis-backed)
- **Multer 2.1** — File uploads (PDFs)
- **pdf-parse 2.4** — Resume text extraction
- **Zod 4.3** — Request validation
- **ws 8.19** — WebSocket server
- **Puppeteer 24.39** — PDF generation (via puppeteer-cluster)
- **Razorpay SDK 2.9** — Payments
- **ioredis** — Redis caching

### AI & Voice
- **Groq + LLaMA 3.1 8B** (via LangChain) — Interview conversations
- **Google Gemini 2.5 Flash** — Resume analysis, structured reports
- **Deepgram Voice Agent** — Real-time speech-to-speech interviews
- **Deepgram Aura** — Text-to-speech

### Infrastructure
- **Vercel** — Frontend hosting (CDN)
- **Render/EC2** — Backend server
- **MongoDB Atlas** — Cloud database
- **Redis** — Caching + rate limiting
- **Razorpay** — Payments
- **Cloudflare Turnstile** — CAPTCHA
- **Brevo** — Transactional emails
- **Cloudinary** — Image hosting

---

## 3. Directory Structure

```
sumora-ai/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: SSH deploy to EC2 on push to main
├── client/                         # React SPA (Vite)
│   ├── public/
│   │   ├── logo.png                # Dark theme logo
│   │   ├── light_logo.png          # Light theme logo
│   │   ├── overlay.mp4             # Hero background video
│   │   ├── robots.txt              # SEO robots
│   │   ├── sitemap.xml             # SEO sitemap
│   │   ├── assests.js              # Cloudinary image URLs
│   │   ├── dashboard_home.png      # Dashboard screenshots (dark)
│   │   ├── dashboard_home_light.png
│   │   ├── dashboard_stats.png
│   │   ├── dashboard_stats_light.png
│   │   ├── dashboard_interview.png
│   │   ├── dashboard_interview_light.png
│   │   ├── dashboard_prepare.png
│   │   └── dashboard_prepare_light.png
│   ├── src/
│   │   ├── main.jsx                # App entry, router, providers
│   │   ├── App.jsx                 # Route definitions
│   │   ├── index.css               # Global styles + Tailwind
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state + API calls
│   │   │   └── InterviewContext.jsx # Interview/report API calls
│   │   ├── hooks/
│   │   │   ├── useDeepgramVoiceAgent.js  # Deepgram Voice Agent WS
│   │   │   ├── useDeepgramTTS.js         # Deepgram TTS
│   │   │   └── useServiceExitGuard.js    # Route blocker for sessions
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance (baseURL)
│   │   │   └── utils.js            # cn() helper (clsx + twMerge)
│   │   ├── shared/
│   │   │   ├── companyInterviewProfiles.js  # 40 companies + 20+ roles
│   │   │   └── pricing.json               # Token pack pricing
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyOtpPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   └── components/
│   │       ├── home/
│   │       │   ├── BackgroundGradient.jsx
│   │       │   ├── CommunitySection.jsx
│   │       │   ├── CTASection.jsx
│   │       │   ├── DashboardMockup.jsx
│   │       │   ├── FAQSection.jsx
│   │       │   ├── FeatureSection.jsx
│   │       │   ├── Footer.jsx
│   │       │   ├── HowItWorksSection.jsx
│   │       │   ├── IntegrationsSection.jsx
│   │       │   ├── PricingSection.jsx
│   │       │   └── SocialIcons.jsx
│   │       ├── dashboard/
│   │       │   ├── DashboardHome.jsx
│   │       │   ├── Navbar.jsx
│   │       │   ├── Sidebar.jsx
│   │       │   ├── NewInterviewView.jsx
│   │       │   ├── ReportDetailView.jsx
│   │       │   ├── ReportsListView.jsx
│   │       │   ├── interview/
│   │       │   │   ├── InterviewView.jsx
│   │       │   │   ├── VoiceInterviewAgent.jsx
│   │       │   │   ├── InterviewHistoryDetail.jsx
│   │       │   │   └── InterviewFeedback.jsx
│   │       │   ├── prepare/
│   │       │   │   └── PrepareView.jsx
│   │       │   ├── analyze/
│   │       │   │   └── AnalyzeView.jsx
│   │       │   ├── coding/
│   │       │   │   ├── CodingInterviewView.jsx
│   │       │   │   ├── CodingInterviewHistoryDetail.jsx
│   │       │   │   └── CodingInterviewFeedback.jsx
│   │       │   ├── billing/
│   │       │   │   └── BillingView.jsx
│   │       │   └── views/
│   │       │       └── StatsView.jsx
│   │       ├── ui/
│   │       │   ├── liquid-metal-button.jsx
│   │       │   ├── tooltip.jsx
│   │       │   ├── button.jsx
│   │       │   └── database-with-rest-api.jsx
│   │       ├── AuthLayout.jsx
│   │       ├── Input.jsx
│   │       ├── Button.jsx
│   │       ├── UserDropdown.jsx
│   │       ├── AccountModal.jsx
│   │       ├── CommandPalette.jsx
│   │       ├── TokenConfirmModal.jsx
│   │       ├── SiteFeedbackModal.jsx
│   │       ├── ServerWakeOverlay.jsx
│   │       ├── ServiceExitConfirmModal.jsx
│   │       ├── RouteError.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── SeoManager.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vercel.json
├── server/
│   ├── server.js                   # Entry: MongoDB, Redis, Puppeteer init
│   ├── src/
│   │   ├── app.js                  # Express app: CORS, routes, health
│   │   ├── configs/
│   │   │   ├── app.config.js       # Central config (tokens, limits, AI models)
│   │   │   ├── mongodb.config.js   # Mongoose connection
│   │   │   ├── companyInterviewPrompts.js  # 40 company interview styles
│   │   │   ├── companyInterviewPrompts.test.js
│   │   │   └── pricing.json        # Token pack definitions
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── codingInterview.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   ├── liveInterview.model.js
│   │   │   ├── session.model.js
│   │   │   ├── otp.model.js
│   │   │   ├── transaction.model.js
│   │   │   ├── blacklist.model.js
│   │   │   └── siteFeedback.model.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # JWT verification
│   │   │   ├── file.middleware.js       # Multer memory upload
│   │   │   ├── rateLimiter.middleware.js # Redis-backed rate limiters
│   │   │   └── validate.middleware.js   # Input sanitization
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── interview.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── feedback.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── codingInterview.controller.js
│   │   │   ├── interview.controller.js
│   │   │   ├── liveInterview.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── feedback.controller.js
│   │   └── services/
│   │       ├── ai.service.js            # Gemini: report generation, resume PDF
│   │       ├── interviewService.js      # Groq/LangChain: interview chains
│   │       ├── codingInterviewService.js # Groq/LangChain: coding chains
│   │       ├── redis.service.js         # Redis cache operations
│   │       ├── pdfPool.service.js       # Puppeteer cluster for PDFs
│   │       ├── brevo.service.js         # Brevo email: OTP, promo, reminder
│   │       ├── turnstile.service.js     # Cloudflare Turnstile verification
│   │       └── emails/
│   │           ├── promoEmail.template.js
│   │           └── reminderEmail.template.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── README.md                      # AI system documentation
├── summary.md                     # Launch documentation
└── .commandcode/taste/taste.md
```

---

## 4. Server — Entry & Config

### `server/server.js`
- Imports dotenv, app, connects MongoDB
- Initializes Puppeteer cluster for PDF generation (`initPdfCluster`)
- Connects Redis
- Listens on `PORT` (default 3000)
- Graceful shutdown handlers (SIGTERM/SIGINT) close Redis + Puppeteer + HTTP server

### `server/src/app.js`
- Express app with `trust proxy` for Render
- **Security:** Helmet headers, CORS (allows `sumoraai.in`, `localhost:5173`)
- **Parsing:** JSON 16kb limit, URL-encoded, cookie-parser
- **Routes:** `/api/auth`, `/api/interview`, `/api/payment`, `/api/feedback`
- **Health:** `GET /api/health` returns `{ status: "ok" }`

### `server/src/configs/app.config.js`
Central configuration object exporting `CONFIG`:
- **ai.GEMINI_MODEL:** `gemini-2.5-flash`
- **ai.GROQ_MODEL:** `process.env.GROQ_MODEL || "openai/gpt-oss-120b"`
- **ai.TEMPERATURE:** 0.7
- **ai.MAX_RETRIES:** 3
- **tokens.REPORT_GENERATION:** 25
- **tokens.LIVE_INTERVIEW:** 20
- **tokens.PREPARE_INTERVIEW:** 20
- **tokens.CODING_INTERVIEW:** 35
- **limits.RESUME_TEXT_MAX:** 8000 chars
- **limits.JOB_DESCRIPTION_MAX:** 5000 chars
- **limits.SELF_DESCRIPTION_MAX:** 2000 chars
- **limits.ROLE_MAX_LENGTH:** 150
- **upload.MAX_FILE_SIZE_BYTES:** 10MB
- **interview.DURATION_MS:** 30 min (job), 45 min (coding)
- **interview.MIN_ANSWERS_FOR_ANALYSIS:** 3
- **interview.DIFFICULTIES:** `["easy", "medium", "hard"]`
- **pdf:** FORMAT, MARGIN, SCALE settings for Puppeteer
- **rateLimit:** auth/OTP/API/AI window sizes and max requests
- **export function `parsePagination(query)`:** extracts page/limit/skip

### `server/src/configs/mongodb.config.js`
- Connects to MongoDB Atlas via `MONGO_URI` env var

---

## 5. Server — Models

### `user.model.js` — User
| Field | Type | Notes |
|---|---|---|
| username | String | unique, 3-30 chars, alphanumeric+underscore |
| email | String | unique |
| password | String | optional (Google OAuth users) |
| googleId | String | sparse unique |
| authProvider | String | `"local"` or `"google"` |
| isVerified | Boolean | default false |
| tokens | Number | default 100 (free tokens) |

- Index: `{ email: 1, isVerified: 1 }`
- `toJSON()` strips password and `__v`

### `codingInterview.model.js` — CodingInterview
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | indexed |
| mode | String | always `"coding"` |
| language | String | default `"python"` |
| difficulty | String | `"easy"`/`"medium"`/`"hard"` |
| problemStatement | String | |
| starterCode | String | |
| conversation | Array of `{ role, text, codeSubmission? }` | |
| feedback | String | serialized JSON |
| score | Number | 0-100 |
| status | String | `"active"` or `"completed"` |
| codeSubmissions | Array of `{ language, code, submittedAt }` | |

### `interviewReport.model.js` — InterviewReport
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → User | indexed |
| session | ObjectId → Session | nullable |
| role | String | |
| jobDescription | String | |
| selfDescription | String | |
| title | String | AI-derived |
| matchScore | Number | 0-100 |
| technicalQuestions | Array | `{ question, intention, answer }` |
| behavioralQuestions | Array | `{ question, intention, answer }` |
| skillGaps | Array | `{ skill, severity(low/medium/high) }` |
| preparationPlan | Array | `{ day, focus, tasks[] }` |
| resumePdfUrl | String | Cloudinary URL |

### `liveInterview.model.js` — LiveInterview
| Field | Type | Notes |
|---|---|---|
| mode | String | `"job"` or `"prepare"` |
| session | ObjectId → Session | nullable |
| user | ObjectId → User | |
| resumeText | String | |
| role, jobDescription | String | job-mode |
| companyKey, companyName, companyWebsite | String | |
| companyPromptTitle, companyPromptDescription | String | |
| subject, topic | String | prepare-mode |
| conversation | Array | `{ question, answer }` |
| feedback | String | serialized JSON |
| userFeedback | `{ rating(1-5), comment, submittedAt }` | |
| score | Number | 0-100 |
| status | String | `"active"` or `"completed"` |
| difficulty | String | |

### `session.model.js` — Session
Groups related interviews. Fields: `user`, `title`, `jobTitle`, `jobDescription`, `selfDescription`.

### `otp.model.js` — OTP
- Types: `"registration"`, `"forgot-password"`, `"change-password"`, `"change-email"`
- Auto-hashes OTP with SHA-256 on save
- TTL index auto-deletes after 10 minutes
- Max 5 attempts, then deletes record
- Static `verifyOtp(email, plainOtp, type)` method

### `transaction.model.js` — Transaction
Razorpay payment record: `user`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `amount`, `currency`, `tokensAdded`, `planId`, `status`, `refund_id`.

### `blacklist.model.js` — Blacklist
JWT blacklist for logout. TTL index auto-expires after 24 hours.

### `siteFeedback.model.js` — SiteFeedback
In-app feedback: `user`, `name`, `email`, `subject`, `message`, `status("new"|"reviewed")`.

---

## 6. Server — Middlewares

### `auth.middleware.js`
- Extracts JWT from `req.cookies.token` or `Authorization` header
- Checks Redis blacklist cache first, falls back to MongoDB
- Verifies token with `jwt.verify`
- Sets `req.user = { id, username }`

### `file.middleware.js`
- Multer with memory storage, max 10MB file size

### `rateLimiter.middleware.js`
Four rate limiters (Redis-backed via `rate-limit-redis`):
| Limiter | Window | Max Requests |
|---|---|---|
| authLimiter | 15 min | From CONFIG |
| otpLimiter | 15 min | From CONFIG |
| apiLimiter | 15 min | From CONFIG |
| aiLimiter | 1 hour | From CONFIG |

### `validate.middleware.js`
Uses `validator` library. Functions:
- `validateRegister` — username (3-30, alphanumeric+underscore), email, password (6-128)
- `validateLogin` — email + password
- `validateTurnstile` — captcha token
- `validateEmail` — email only
- `validateOtp` — 6-digit numeric string
- `validateResetPassword` — email + OTP + new password
- `validateChangePassword` — OTP + new password
- `validateUpdateProfile` — username only
- `validateNewEmail` — new email
- `validateEmailChangeOtp` — new email + OTP

---

## 7. Server — Routes

### `auth.routes.js`
| Method | Path | Auth | Rate Limit | Middleware | Handler |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | No | authLimiter | Turnstile, Register | `registerUserController` |
| POST | `/api/auth/verify-otp` | No | authLimiter | OTP | `verifyOtpController` |
| POST | `/api/auth/resend-otp` | No | otpLimiter | Email | `resendOtpController` |
| POST | `/api/auth/login` | No | authLimiter | Turnstile, Login | `loginUserController` |
| POST | `/api/auth/logout` | No | — | — | `logoutUserController` |
| POST | `/api/auth/google` | No | authLimiter | — | `googleLoginController` |
| POST | `/api/auth/forgot-password` | No | otpLimiter | Email | `forgotPasswordController` |
| POST | `/api/auth/reset-password` | No | authLimiter | ResetPassword | `resetPasswordController` |
| GET | `/api/auth/me` | Yes | apiLimiter | — | `getCurrentUserController` |
| PUT | `/api/auth/update-profile` | Yes | apiLimiter | UpdateProfile | `updateProfileController` |
| POST | `/api/auth/send-email-change-otp` | Yes | otpLimiter | NewEmail | `sendEmailChangeOtpController` |
| POST | `/api/auth/verify-email-change` | Yes | authLimiter | EmailChangeOtp | `verifyEmailChangeController` |
| POST | `/api/auth/send-change-password-otp` | Yes | otpLimiter | — | `sendChangePasswordOtpController` |
| POST | `/api/auth/change-password` | Yes | authLimiter | ChangePassword | `changePasswordController` |
| POST | `/api/auth/set-password` | Yes | authLimiter | — | `setPasswordController` |
| DELETE | `/api/auth/delete-account` | Yes | apiLimiter | — | `deleteAccountController` |

### `interview.routes.js`
| Method | Path | Auth | Rate Limit | Handler |
|---|---|---|---|---|
| POST | `/api/interview/` | Yes | aiLimiter | `generateInterViewReportController` |
| GET | `/api/interview/reports` | Yes | apiLimiter | `getAllReportsController` |
| GET | `/api/interview/report/:interviewId` | Yes | apiLimiter | `getInterviewReportByIdController` |
| POST | `/api/interview/resume/pdf/:id` | Yes | aiLimiter | `generateResumePdfController` |
| DELETE | `/api/interview/report/:interviewId` | Yes | apiLimiter | `deleteReportController` |
| POST | `/api/interview/upload-resume` | Yes | apiLimiter | `uploadResumeController` |
| POST | `/api/interview/start` | Yes | aiLimiter | `startInterviewController` |
| POST | `/api/interview/prepare/start` | Yes | aiLimiter | `startPrepareController` |
| POST | `/api/interview/answer` | Yes | apiLimiter | `answerInterviewController` |
| POST | `/api/interview/end` | Yes | aiLimiter | `endInterviewController` |
| GET | `/api/interview/live` | Yes | apiLimiter | `getAllLiveInterviewsController` |
| GET | `/api/interview/live/:interviewId` | Yes | apiLimiter | `getLiveInterviewController` |
| DELETE | `/api/interview/live/:interviewId` | Yes | apiLimiter | `deleteLiveInterviewController` |
| POST | `/api/interview/fetch-job` | Yes | apiLimiter | `fetchJobController` |
| POST | `/api/interview/analyze-question` | Yes | aiLimiter | `analyzeQuestionController` |
| POST | `/api/interview/voice-agent-response` | Yes | apiLimiter | `voiceAgentResponseController` |
| POST | `/api/interview/feedback` | Yes | apiLimiter | `submitInterviewFeedbackController` |
| GET | `/api/interview/coding/languages` | Yes | apiLimiter | `getLanguagesController` |
| POST | `/api/interview/coding/start` | Yes | aiLimiter | `startCodingInterviewController` |
| POST | `/api/interview/coding/submit` | Yes | apiLimiter | `submitCodeController` |
| POST | `/api/interview/coding/message` | Yes | apiLimiter | `sendMessageController` |
| POST | `/api/interview/coding/end` | Yes | aiLimiter | `endCodingInterviewController` |
| GET | `/api/interview/coding` | Yes | apiLimiter | `getAllCodingInterviewsController` |
| GET | `/api/interview/coding/:interviewId` | Yes | apiLimiter | `getCodingInterviewController` |
| DELETE | `/api/interview/coding/:interviewId` | Yes | apiLimiter | `deleteCodingInterviewController` |
| POST | `/api/interview/coding/voice-agent-response` | Yes | apiLimiter | `codingVoiceAgentResponseController` |

### `payment.routes.js`
All routes protected by `authMiddleware`.
| Method | Path | Handler |
|---|---|---|
| GET | `/api/payment/tokens` | `getUserTokens` |
| POST | `/api/payment/create-order` | `createOrder` |
| POST | `/api/payment/verify` | `verifyPayment` |
| POST | `/api/payment/refund` | `requestRefund` |

### `feedback.routes.js`
| Method | Path | Auth | Handler |
|---|---|---|---|
| POST | `/api/feedback` | Yes | `submitSiteFeedbackController` |

---

## 8. Server — Controllers

### `auth.controller.js`
**Exports 14 handlers:**
- `registerUserController` — Turnstile verify → create user → send OTP email
- `verifyOtpController` — Verify OTP → set isVerified → JWT cookie
- `resendOtpController` — Generate new OTP, resend
- `loginUserController` — Turnstile → password check → JWT + Redis cache
- `logoutUserController` — Blacklist token + clear cookie
- `getCurrentUserController` — Get user from cache or DB
- `updateProfileController` — Update username → new JWT → invalidate cache
- `sendEmailChangeOtpController` — Send OTP to new email
- `verifyEmailChangeController` — Verify OTP → update email
- `sendChangePasswordOtpController` — Send OTP to current email
- `changePasswordController` — Verify OTP → hash new password
- `forgotPasswordController` — Send OTP (doesn't reveal email existence)
- `resetPasswordController` — Verify OTP → hash new password
- `googleLoginController` — Google OAuth → find/create user → JWT
- `setPasswordController` — Set password for Google-only users
- `deleteAccountController` — Blacklist token → delete user + OTPs

### `interview.controller.js`
**Exports 5 handlers:**
- `generateInterViewReportController` — Parse optional PDF → call Gemini `generateInterviewReport` → save report → deduct 25 tokens
- `getInterviewReportByIdController` — Get single report (with Redis cache)
- `getAllReportsController` — Paginated list of reports
- `generateResumePdfController` — Call Gemini `generateResumePdf` → stream PDF
- `deleteReportController` — Delete report + invalidate cache

### `liveInterview.controller.js`
**Exports 11 handlers:**
- `uploadResumeController` — Parse PDF → return extracted text
- `startInterviewController` — Validate → check tokens(20) → create LiveInterview → `initInterview` → first question → deduct tokens
- `startPrepareController` — Create prepare-mode LiveInterview → `initPrepareInterview` → first question → deduct 20 tokens
- `answerInterviewController` — Recover chain if needed → `sendAnswer` → next question
- `endInterviewController` — `generateFeedback` → compute overall score → cleanup chain
- `getLiveInterviewController` — Get single interview
- `getAllLiveInterviewsController` — Paginated list, optional `?mode=` filter
- `deleteLiveInterviewController` — Delete + cleanup
- `submitInterviewFeedbackController` — Save star rating + comment
- `analyzeQuestionController` — `analyzeQuestion` → structured teaching JSON
- `voiceAgentResponseController` — Deepgram function call handler
- `fetchJobController` — Scrape LinkedIn job URL → extract role + description

### `codingInterview.controller.js`
**Exports 9 handlers:**
- `getLanguagesController` — List supported languages (python, java, cpp, javascript, typescript, go, rust, csharp)
- `startCodingInterviewController` — Check tokens(35) → create CodingInterview → `initCodingInterview` → parse problem → deduct tokens
- `submitCodeController` — Recover chain → `sendCodeSubmission` → save analysis
- `sendMessageController` — Chat message during coding
- `endCodingInterviewController` — `generateFeedback` → cleanup
- `getCodingInterviewController` — Get single interview
- `getAllCodingInterviewsController` — Paginated list
- `deleteCodingInterviewController` — Delete + cleanup
- `codingVoiceAgentResponseController` — Deepgram function call for coding

### `payment.controller.js`
Razorpay integration:
- `createOrder` — Create Razorpay order
- `verifyPayment` — Verify signature → add tokens → create transaction
- `requestRefund` — Razorpay refund → update transaction status
- `getUserTokens` — Return current token balance

### `feedback.controller.js`
- `submitSiteFeedbackController` — Save site feedback document

---

## 9. Server — Services

### `ai.service.js` — Gemini AI
**Exports:** `generateInterviewReport`, `generateResumePdf`

- Uses `@google/genai` (GoogleGenAI) with `GOOGLE_API_KEY`
- `generateInterviewReport`: Sends resume + self-description + JD → returns structured JSON with `matchScore`, `technicalQuestions[]`, `behavioralQuestions[]`, `skillGaps[]`, `preparationPlan[]`, `title`
- `generateResumePdf`: Returns JSON `{ html }` → converts HTML to PDF via Puppeteer cluster
- Uses Zod schemas converted to Gemini JSON schema format
- `toGeminiSchema()` strips `$schema` and `additionalProperties` for Gemini compatibility
- `extractText()` safely extracts text from Gemini responses (handles thinking models)

### `interviewService.js` — Groq/LangChain Interview Chains
**Exports:** `initInterview`, `initPrepareInterview`, `sendAnswer`, `recoverChain`, `generateFeedback`, `analyzeQuestion`, `cleanupChain`

**In-memory state:**
- `activeChains: Map<interviewId, RunnableWithMessageHistory>`
- `messageHistories: Map<interviewId, InMemoryChatMessageHistory>`

**Key functions:**
- `buildChain()` — Creates `ChatPromptTemplate` → `ChatGroq` → `RunnableWithMessageHistory`
- `makeSystemPrompt()` — Builds job interview system prompt with company style, difficulty, resume context
- `makePrepareSystemPrompt()` — Builds topic-locked prepare mode prompt with strict rules
- `getDifficultyInstructions()` — Easy/Medium/Hard difficulty modifiers
- `initInterview()` — First question generation
- `initPrepareInterview()` — Prepare mode first question
- `sendAnswer()` — Submit answer → next question
- `recoverChain()` — Rebuild chain from stored conversation after server restart
- `generateFeedback()` — One-shot LLM call for structured feedback with question breakdown
- `analyzeQuestion()` — Teaching response: `{ why, structure, sampleAnswer, tip }`

**JSON parsing:** `safeJsonParse()` repairs invalid escape sequences; `extractJsonCandidate()` extracts JSON from markdown-fenced responses.

### `codingInterviewService.js` — Groq/LangChain Coding Chains
**Exports:** `initCodingInterview`, `sendCodeSubmission`, `sendMessage`, `analyzeCode`, `generateFeedback`, `recoverChain`, `cleanupChain`, `getSupportedLanguages`, `getStarterCode`

- Same in-memory chain pattern as interviewService
- `LANGUAGE_TEMPLATES` — Starter code templates for 8 languages
- `CODING_SYSTEM_TEMPLATE` — System prompt for coding interviews
- `CODE_ANALYSIS_TEMPLATE` — One-shot code review prompt
- `FEEDBACK_TEMPLATE` — End-of-interview feedback prompt
- `sendCodeSubmission()` — Conversational code review (not one-shot dump)
- 45-minute interview duration

### `redis.service.js` — Redis Cache
**Exports:** `redis`, `closeRedis`, `CACHE_KEYS`, `CACHE_TTL`, `cacheGet`, `cacheSet`, `cacheDel`, `cacheDelPattern`, `cacheOrFetch`, `invalidateUserCache`

**Cache keys:** `user:{id}`, `user:tokens:{id}`, `reports:list:{userId}:{page}:{limit}`, `report:{id}`, `interviews:list:{userId}:{mode}:{page}:{limit}`, `interview:{id}`, `ai:report:{hash}`, `blacklist:{token}`

**TTLs:** User 5min, Reports list 2min, Report 5min, Interviews list 2min, Interview 5min, AI report 10min, Blacklist 24h

### `pdfPool.service.js` — Puppeteer PDF Generation
**Exports:** `initPdfCluster`, `generatePdfFromHtml`, `closePdfCluster`
- Uses `puppeteer-cluster` with max 3 concurrent pages
- Reuses browser instances across requests

### `brevo.service.js` — Email Service
**Exports:** `sendOtpEmail`, `generateOtp`, `sendPromotionalEmail`, `sendReminderEmail`
- Uses Brevo (formerly Sendinblue) SMTP API
- OTP generation: 6-digit random number
- Three email types: registration, forgot-password, change-password, change-email
- Promo and reminder email templates

### `turnstile.service.js` — Cloudflare Turnstile
**Exports:** `verifyTurnstileToken`
- POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`

### `emails/promoEmail.template.js`
Promotional email HTML template with brand colors (#ea580c)

### `emails/reminderEmail.template.js`
Reminder email HTML template

---

## 10. Client — Entry & Config

### `client/package.json`
- Scripts: `dev` (vite), `build` (vite build), `lint` (eslint), `preview` (vite preview)
- Key deps: React 19.2, Vite 8.0, Tailwind 3.4, Framer Motion 12.38, Three.js, Monaco Editor, Radix UI, Axios, Lenis, GSAP, react-turnstile, react-hot-toast, react-router-dom 7.13, @react-oauth/google

### `client/vite.config.js`
- React plugin
- Dev proxy: `/api` → `https://api.sumoraai.in`
- Cross-Origin-Opener-Policy header

### `client/tailwind.config.js`
- Content: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Dark mode: `"class"`
- Custom fonts: `Chakra Petch` (sans), `Instrument Serif` (serif)

### `client/postcss.config.js`
- Plugins: tailwindcss, autoprefixer

### `client/vercel.json`
- Build: `npm run build`, output `dist`
- Routes: `/api/*` proxied to `http://13.207.170.168:3000/api/$1`
- SPA fallback: `/*` → `/index.html`

### `client/src/main.jsx`
- `createBrowserRouter` with `App` as root, `RouteError` as error element
- Providers: `GoogleOAuthProvider` → `AuthProvider` → `InterviewProvider`
- Toaster: top-center, dark theme, 3s duration
- Vercel Analytics + Speed Insights

### `client/src/App.jsx`
**Routes:**
| Path | Component | Auth |
|---|---|---|
| `/` | `HomePage` | Public |
| `/login` | `LoginPage` | Public (redirect if logged in) |
| `/register` | `RegisterPage` | Public (redirect if logged in) |
| `/verify-otp` | `VerifyOtpPage` | Public |
| `/forgot-password` | `ForgotPasswordPage` | Public |
| `/reset-password` | `ResetPasswordPage` | Public |
| `/dashboard` | `DashboardPage` | Protected |
| `/dashboard/` (index) | `DashboardHome` | Protected |
| `/dashboard/interview` | `InterviewView` | Protected |
| `/dashboard/coding` | `CodingInterviewView` | Protected |
| `/dashboard/analyze` | `AnalyzeView` | Protected |
| `/dashboard/prepare` | `PrepareView` | Protected |
| `/dashboard/stats` | `StatsView` | Protected |
| `/dashboard/billing` | `BillingView` | Protected |
| `*` | Redirect to `/` | — |

- `ProtectedRoute` — Redirects to `/login` if no user
- `PublicRoute` — Redirects to `/dashboard` if logged in
- Lenis smooth scroll on homepage only
- `SeoManager` + `ServerWakeOverlay` always mounted

### `client/src/index.css`
- Tailwind base/components/utilities
- Base typography: h1-h4 with Chakra Petch font
- Scrollbar hidden globally
- Dark mode body background `#000`, light `#f9fafb`

---

## 11. Client — Context Providers

### `AuthContext.jsx`
**State:** `user`, `loading`

**Methods:**
- `fetchUser()` — `GET /auth/me` (5s timeout)
- `register(username, email, password, turnstileToken)`
- `verifyOtp(email, otp)`
- `resendOtp(email)`
- `login(email, password, turnstileToken)`
- `googleLogin(credential)`
- `setPassword(newPassword)`
- `logout()`
- `forgotPassword(email)`
- `resetPassword(email, otp, newPassword)`
- `updateProfile(updates)`
- `sendEmailChangeOtp(newEmail)`
- `verifyEmailChange(newEmail, otp)`
- `sendChangePasswordOtp()`
- `changePassword(otp, newPassword)`
- `deleteAccount()`

All API calls go through `api` instance (`/api` prefix).

### `InterviewContext.jsx`
**Methods:**
- `generateReport(payload, resumeFile)` — POST `/interview` (FormData)
- `getAllReports()` — GET `/interview/reports`
- `getReportById(id)` — GET `/interview/report/:id`
- `generatePdf(id)` — POST blob download
- `uploadResume(file)` — POST FormData
- `startInterview(payload)` — POST `/interview/start`
- `startPrepareInterview(payload)` — POST `/interview/prepare/start`
- `answerInterview(id, answer)` — POST `/interview/answer`
- `endInterview(id, options)` — POST `/interview/end`
- `submitInterviewFeedback(payload)` — POST `/interview/feedback`
- `getAllLiveInterviews(mode)` — GET `/interview/live`
- `getLiveInterviewById(id)` — GET `/interview/live/:id`
- `analyzeQuestion(id, questionIndex)` — POST `/interview/analyze-question`
- `deleteLiveInterview(id)` — DELETE
- `deleteReport(id)` — DELETE
- `fetchJobFromUrl(url)` — POST `/interview/fetch-job`
- `getCodingLanguages()` — GET `/interview/coding/languages`
- `startCodingInterview(payload)` — POST `/interview/coding/start`
- `submitCode(payload)` — POST `/interview/coding/submit`
- `sendCodingMessage(payload)` — POST `/interview/coding/message`
- `endCodingInterview(id)` — POST `/interview/coding/end`
- `getAllCodingInterviews(page, limit)` — GET `/interview/coding`
- `getCodingInterviewById(id)` — GET `/interview/coding/:id`
- `deleteCodingInterview(id)` — DELETE

---

## 12. Client — Hooks

### `useDeepgramVoiceAgent.js`
**Returns:** `{ connect, disconnect, sendMessage, flushAgentQueues, isConnected, isLoading, isAgentSpeaking, isUserSpeaking }`

- Connects to Deepgram Agent WebSocket (`wss://agent.deepgram.com/v1/agent/converse`)
- Streams microphone audio (16kHz PCM)
- Plays agent audio (24kHz PCM) via Web Audio API
- Handles Deepgram function calls → POST to backend `/api/interview/voice-agent-response`
- Fallback: if no function call received within 4s, manually calls backend
- Speak modes: `"normal"` (continuous) or `"hold"` (spacebar push-to-talk)
- Deduplicates conversation text
- Queues audio/text when spacebar is held

### `useDeepgramTTS.js`
**Returns:** `{ speak, stop, isSpeaking, isSynthesizing, isModelLoading: false }`

- REST API TTS via Deepgram Aura (`aura-2-ophelia-en`)
- Requires `VITE_DEEPGRAM_API_KEY`

### `useServiceExitGuard.js`
**Returns:** `{ isOpen, isConfirming, requestExit, confirmExit, cancelExit }`

- Uses React Router `useBlocker` to prevent navigation during active sessions
- `requestExit(action)` — shows confirmation modal, executes action on confirm
- Handles `beforeunload` for browser tab close

---

## 13. Client — Lib Utilities

### `api.js`
```js
const API_BASE_URL = "https://api.sumoraai.in";
const api = axios.create({ baseURL: `${API_BASE_URL}/api`, withCredentials: true });
export { API_BASE_URL };
export default api;
```

### `utils.js`
```js
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

---

## 14. Client — Shared Data

### `companyInterviewProfiles.js`
**Exports:** `JOB_ROLES`, `COMPANIES`, `getRoleByKey(key)`

**JOB_ROLES** (20 roles):
`software_engineer`, `fullstack_dev`, `backend_dev`, `frontend_dev`, `mobile_dev`, `ai_engineer`, `ml_engineer`, `genai_engineer`, `prompt_engineer`, `data_scientist`, `data_analyst`, `data_engineer`, `cloud_engineer`, `cloud_architect`, `devops_engineer`, `sre`, `cybersecurity`, `ethical_hacker`, `product_manager`, `technical_pm`, `uiux`, `blockchain_dev`, `automation_dev`, `ai_ethics`

Each role has: `key`, `name`, `jobDescription`, `tools[]`, `skills[]`

**COMPANIES** (40 total):
- India (23): TCS, Infosys, Wipro, HCL, Tech Mahindra, LTIMindtree, Cognizant, Zoho, Paytm, Flipkart, Ola, Swiggy, Zomato, Razorpay, Freshworks, CRED, PhonePe, Delhivery, Meesho, Mphasis, Persistent Systems, Capgemini India, Accenture India
- Global (17): Google, Amazon, Microsoft, Meta, Apple, Netflix, Uber, Airbnb, Stripe, Salesforce, Adobe, Oracle, SAP, IBM, Accenture, Deloitte, McKinsey

Each company has: `key`, `name`, `region`, `logoUrl` (logo.dev), `website`, `description` (detailed interview process), `availableRoles[]`

### `pricing.json`
Token pack definitions for Razorpay integration.

---

## 15. Client — Pages

### `HomePage.jsx` (406 lines)
Landing page with:
- Hero section with animated gradient background
- Navbar with theme toggle, navigation links, login CTA
- `DashboardMockup` — hero visual
- `IntegrationsSection` — AI model showcase
- `FeatureSection` — 4 core features
- `DatabaseWithRestApi` — AI models visual
- `HowItWorksSection` — 3-step process
- `PricingSection` — token packs
- `FAQSection` — common questions
- `CommunitySection` — social proof
- `CTASection` — final call to action
- `Footer` — links, copyright
- Uses `FadeIn` component for scroll animations
- Dark/light theme with localStorage persistence

### `DashboardPage.jsx` (294 lines)
Dashboard shell with:
- Slim icon sidebar (desktop: 80px, mobile: slide-in overlay)
- Top navbar with breadcrumb, search (Cmd+K), theme toggle, token balance, user dropdown
- `Outlet` for nested routes
- Pages: Home, Prepare, Interview, Coding, Analyze, Stats, Billing
- `AccountModal`, `CommandPalette`, `SiteFeedbackModal`

### `LoginPage.jsx` (204 lines)
- Google OAuth button + email/password form
- Cloudflare Turnstile CAPTCHA
- Links to register, forgot password

### `RegisterPage.jsx` (214 lines)
- Google OAuth + username/email/password form
- Turnstile CAPTCHA
- Redirects to verify-otp page

### `VerifyOtpPage.jsx` (161 lines)
- 6-digit OTP input with auto-focus, paste support
- Resend with 30s cooldown

### `ForgotPasswordPage.jsx` (85 lines)
- Email input → sends OTP

### `ResetPasswordPage.jsx` (195 lines)
- OTP input + new password with show/hide toggle

---

## 16. Client — Components

### Home Components
- **BackgroundGradient.jsx** — Animated radial gradient background
- **DashboardMockup.jsx** — Hero dashboard preview with screenshots
- **IntegrationsSection.jsx** — AI model cards (Gemini, Groq, Deepgram)
- **FeatureSection.jsx** — 4 feature cards (Interview, Prepare, Analyze, Stats)
- **HowItWorksSection.jsx** — 3-step process
- **PricingSection.jsx** — Token packs + pricing
- **FAQSection.jsx** — Accordion FAQ
- **CommunitySection.jsx** — Social proof / testimonials
- **CTASection.jsx** — Final CTA
- **Footer.jsx** — Links, copyright
- **SocialIcons.jsx** — Social media links

### Dashboard Components
- **DashboardHome.jsx** — Dashboard overview
- **Navbar.jsx** — Top navigation bar
- **Sidebar.jsx** — Icon sidebar navigation
- **NewInterviewView.jsx** — Interview setup flow (company → role → config → start)
- **ReportsListView.jsx** — Paginated report list
- **ReportDetailView.jsx** — Single report detail view
- **interview/InterviewView.jsx** — Job interview mode selector + history
- **interview/VoiceInterviewAgent.jsx** — Live voice interview UI with Deepgram
- **interview/InterviewHistoryDetail.jsx** — Past interview detail
- **interview/InterviewFeedback.jsx** — Post-interview feedback form
- **prepare/PrepareView.jsx** — Subject/topic picker + prepare session
- **analyze/AnalyzeView.jsx** — Resume upload + JD → report generation
- **coding/CodingInterviewView.jsx** — Coding interview setup + Monaco editor
- **coding/CodingInterviewHistoryDetail.jsx** — Past coding interview detail
- **coding/CodingInterviewFeedback.jsx** — Coding interview feedback
- **billing/BillingView.jsx** — Token balance + Razorpay purchase
- **views/StatsView.jsx** — Performance analytics dashboard

### Shared Components
- **AuthLayout.jsx** — Split-screen auth layout (dark left panel + form right)
- **Input.jsx** — Styled input component
- **Button.jsx** — Styled button (primary/secondary/ghost variants)
- **UserDropdown.jsx** — User menu (compact/sidebar/default modes)
- **AccountModal.jsx** — Username change, email change, password change, account deletion
- **CommandPalette.jsx** — Cmd+K search palette
- **TokenConfirmModal.jsx** — Token cost confirmation before starting sessions
- **SiteFeedbackModal.jsx** — In-app feedback form
- **ServerWakeOverlay.jsx** — Loading overlay while backend cold-starts
- **ServiceExitConfirmModal.jsx** — Confirmation when leaving active session
- **RouteError.jsx** — Error boundary for routes
- **ErrorBoundary.jsx** — React error boundary
- **SeoManager.jsx** — Dynamic page title/meta tags

### UI Components
- **liquid-metal-button.jsx** — Animated liquid metal CTA button
- **tooltip.jsx** — Radix UI tooltip wrapper
- **button.jsx** — Radix UI button variant
- **database-with-rest-api.jsx** — 3D animated database visual

---

## 17. Public Assets

- `logo.png` — Dark theme logo (Cloudinary)
- `light_logo.png` — Light theme logo
- `overlay.mp4` — Hero background video
- `robots.txt` — SEO
- `sitemap.xml` — SEO
- `assests.js` — Cloudinary URLs for screenshot images
- `dashboard_*.png` — Dashboard screenshot images (dark + light variants)

---

## 18. CI/CD

### `.github/workflows/deploy.yml`
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/Sumora-AI
            git pull origin main
            cd server
            npm install
            pm2 restart sumora-api
```

- Triggers on push to `main`
- SSH into EC2 → git pull → npm install → pm2 restart

---

## 19. AI System Summary

### Model-to-Task Mapping

| Model | Provider | Used For |
|---|---|---|
| `gemini-2.5-flash` | Google GenAI | Interview report generation, resume PDF HTML |
| `openai/gpt-oss-120b` | Groq (via LangChain) | Live interview conversations, question analysis, feedback |
| `aura-asteria-en` | Deepgram | Voice agent TTS (interview) |
| `aura-2-ophelia-en` | Deepgram | Standalone TTS |
| `nova-2` | Deepgram | Speech-to-text (voice agent) |
| `gpt-4o-mini` | OpenAI (via Deepgram) | Voice agent think/reasoning |

### Session State

**In-memory (lost on restart):**
- `activeChains: Map<interviewId, RunnableWithMessageHistory>`
- `messageHistories: Map<interviewId, InMemoryChatMessageHistory>`

**Persistent (MongoDB):**
- `LiveInterview.conversation[]` — Every AI question/user answer
- `CodingInterview.conversation[]` — Coding interview turns
- `CodingInterview.codeSubmissions[]` — Code submissions

**Recovery:** `recoverChain()` rebuilds in-memory state from MongoDB transcript.

### Token Costs

| Action | Cost |
|---|---|
| Report generation | 25 |
| Live interview start | 20 |
| Prepare interview start | 20 |
| Coding interview start | 35 |

---

## 20. API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register + send OTP
- `POST /verify-otp` — Verify email OTP
- `POST /resend-otp` — Resend OTP
- `POST /login` — Email/password login
- `POST /logout` — Logout + blacklist token
- `POST /google` — Google OAuth login
- `POST /forgot-password` — Send reset OTP
- `POST /reset-password` — Reset with OTP
- `GET /me` — Get current user
- `PUT /update-profile` — Update username
- `POST /send-email-change-otp` — Start email change
- `POST /verify-email-change` — Complete email change
- `POST /send-change-password-otp` — Start password change
- `POST /change-password` — Change password with OTP
- `POST /set-password` — Set password for Google users
- `DELETE /delete-account` — Delete account

### Interview (`/api/interview`)
- `POST /` — Generate AI report
- `GET /reports` — List reports
- `GET /report/:id` — Get single report
- `DELETE /report/:id` — Delete report
- `POST /resume/pdf/:id` — Generate resume PDF
- `POST /upload-resume` — Parse PDF
- `POST /start` — Start job interview
- `POST /prepare/start` — Start prepare session
- `POST /answer` — Submit answer
- `POST /end` — End interview
- `GET /live` — List live interviews
- `GET /live/:id` — Get single live interview
- `DELETE /live/:id` — Delete live interview
- `POST /fetch-job` — Scrape LinkedIn job
- `POST /analyze-question` — AI question analysis
- `POST /voice-agent-response` — Deepgram voice handler
- `POST /feedback` — Submit star rating
- `GET /coding/languages` — List languages
- `POST /coding/start` — Start coding interview
- `POST /coding/submit` — Submit code
- `POST /coding/message` — Chat message
- `POST /coding/end` — End coding interview
- `GET /coding` — List coding interviews
- `GET /coding/:id` — Get coding interview
- `DELETE /coding/:id` — Delete coding interview
- `POST /coding/voice-agent-response` — Coding voice handler

### Payment (`/api/payment`)
- `GET /tokens` — Get token balance
- `POST /create-order` — Create Razorpay order
- `POST /verify` — Verify payment
- `POST /refund` — Request refund

### Feedback (`/api/feedback`)
- `POST /` — Submit site feedback

### Health
- `GET /api/health` — Health check

---

## 21. Environment Variables

### Server
| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 3000) |
| `NODE_ENV` | Production flag |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `GROQ_API_KEY` | Groq API key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `BREVO_API_KEY` | Brevo email API key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `RAZORPAY_KEY_ID` | Razorpay key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_DB` | Redis database number |

### Client
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_DEEPGRAM_API_KEY` | Deepgram API key |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `VITE_LOGO_DEV_TOKEN` | logo.dev token for company logos |

---

*Generated: June 13, 2026*
