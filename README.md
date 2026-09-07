<div align="center">

# 🤖 Sumora AI

### Ace Your Next Interview with AI-Powered Coaching

**AI-driven mock interviews, resume analysis, coding challenges, and personalized preparation plans — all in one platform.**

[![Live](https://img.shields.io/badge/🌐_Live-sumoraai.in-orange?style=for-the-badge)](https://sumoraai.in)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [AI Models & Workflows](#-ai-models--workflows)
- [Token Economy](#-token-economy)
- [Deployment](#-deployment)
- [Docker](#-docker)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

Sumora AI is a full-stack AI interview preparation platform that helps job seekers practice, analyze, and improve their interview skills. It combines multiple AI models to provide realistic mock interviews (text & voice), intelligent resume analysis, coding challenges with a live editor, and structured feedback — all behind a modern, responsive UI.

**Live at:** [sumoraai.in](https://sumoraai.in)

---

## ✨ Key Features

### 🎤 Live AI Interviews
- Real-time AI-powered mock interviews with adaptive questioning
- Three difficulty levels: **Easy**, **Medium**, **Hard**
- Contextual follow-up questions based on your responses
- End-of-interview feedback with technical & communication scores
- **Voice interview mode** with Deepgram real-time audio streaming

### 📄 Resume Analyzer & Report Generation
- Upload your resume (PDF) and job description for AI-powered analysis
- Get a **match score (0-100)**, skill gap analysis, and tailored preparation plan
- Auto-generated **10 technical + 10 behavioral questions** with sample answers
- ATS-optimized resume PDF generation powered by Gemini

### 📚 Prepare Mode (Topic-Locked)
- Study specific subjects/topics with focused AI questioning
- Strict topic enforcement — no off-topic drift
- Progressive difficulty throughout the session
- Analyze individual questions with structured breakdowns

### 💻 Coding Interview
- In-browser **Monaco code editor** (same as VS Code)
- AI-generated coding problems based on role and difficulty
- Real-time code evaluation and feedback

### 📊 Dashboard & Stats
- Personal interview history and performance tracking
- Detailed report views with expandable Q&A sections
- Token balance and billing management

### 🔐 Authentication & Security
- Email/password registration with OTP verification
- Google OAuth integration
- JWT-based session management with HTTP-only cookies
- Cloudflare Turnstile bot protection
- Helmet security headers, CORS whitelisting, rate limiting

### 💳 Payments
- Razorpay integration for token purchases (INR)
- Multiple pricing tiers with transaction history

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **GSAP** | Advanced scroll animations |
| **Lenis** | Smooth scrolling |
| **Monaco Editor** | In-browser code editor |
| **Three.js** | 3D visual effects |
| **Lucide React** | Icon system |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 20** | Runtime |
| **Express 5** | Web framework |
| **MongoDB + Mongoose 9** | Database & ODM |
| **Redis (ioredis)** | Rate limiting & caching |
| **LangChain** | LLM orchestration & chat memory |
| **Google Generative AI** | Gemini model integration |
| **Groq SDK** | LLM orchestration (GPT-OSS / Llama 3.3) |
| **Deepgram SDK** | Voice agent & TTS |
| **Puppeteer** | PDF generation |
| **Razorpay** | Payment processing |
| **Helmet** | Security headers |
| **Zod** | Schema validation |
| **JWT + bcrypt** | Authentication |
| **Multer** | File upload handling |

### AI Models
| Model | Provider | Used For |
|---|---|---|
| `gemini-2.5-flash` | Google | Report generation, resume PDF |
| `openai/gpt-oss-120b` | Groq | Live interview, prepare mode, feedback, question analysis |
| Deepgram Agent | Deepgram | Real-time voice interviews & TTS |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **AWS EC2** | Backend hosting |
| **Docker + Docker Compose** | Containerized deployment |
| **Nginx** | Reverse proxy (Docker) |
| **PM2** | Process management (production) |
| **GitHub Actions** | CI/CD pipeline |
| **Brevo** | Transactional emails |

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────┐
│                         Client                             │
│  React 19 + Vite + Tailwind + Framer Motion                │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────┐ │
│  │ HomePage  │  │ Dashboard │  │ Auth     │  │ Billing   │ │
│  │ (Landing) │  │ + Views   │  │ Pages    │  │ View      │ │
│  └──────────┘  └───────────┘  └──────────┘  └───────────┘ │
│        ↓ Axios          ↓ Deepgram WS                      │
├────────────────────────────────────────────────────────────┤
│                     Express 5 API                          │
│  ┌────────┐  ┌───────────┐  ┌─────────┐  ┌────────────┐  │
│  │ Auth   │  │ Interview │  │ Payment │  │ Feedback   │  │
│  │ Routes │  │ Routes    │  │ Routes  │  │ Routes     │  │
│  └────┬───┘  └─────┬─────┘  └────┬────┘  └─────┬──────┘  │
│       │            │             │              │          │
│  ┌────┴────────────┴─────────────┴──────────────┴───────┐  │
│  │               Middleware Layer                        │  │
│  │  Auth · Validation · Rate Limiting · File Upload      │  │
│  └───────────────────────────────────────────────────────┘  │
│       │            │             │                          │
│  ┌────┴───┐  ┌─────┴──────┐  ┌──┴────────┐                │
│  │ AI     │  │ Interview  │  │ Coding    │                │
│  │Service │  │ Service    │  │ Service   │                │
│  │(Gemini)│  │(LangChain) │  │(Gemini)   │                │
│  └────────┘  └────────────┘  └───────────┘                │
├────────────────────────────────────────────────────────────┤
│  MongoDB         Redis          Puppeteer Cluster          │
│  (Data Store)    (Rate Limit)   (PDF Generation)           │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
sumora-ai/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/                # Landing page sections
│   │   │   │   ├── FeatureSection.jsx
│   │   │   │   ├── HowItWorksSection.jsx
│   │   │   │   ├── PricingSection.jsx
│   │   │   │   ├── FAQSection.jsx
│   │   │   │   ├── CTASection.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── dashboard/           # Dashboard features
│   │   │   │   ├── interview/       # Live interview UI
│   │   │   │   ├── coding/          # Coding interview UI
│   │   │   │   ├── analyze/         # Question analysis UI
│   │   │   │   ├── prepare/         # Prepare mode UI
│   │   │   │   ├── billing/         # Token purchase UI
│   │   │   │   ├── views/           # Stats & analytics
│   │   │   │   ├── DashboardHome.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/                  # Shared UI primitives
│   │   ├── context/                 # React context (Auth)
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useDeepgramVoiceAgent.js
│   │   │   ├── useDeepgramTTS.js
│   │   │   └── useServiceExitGuard.js
│   │   ├── pages/                   # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ...
│   │   ├── lib/                     # Utilities
│   │   ├── App.jsx                  # Router & layout
│   │   └── main.jsx                 # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── interview.controller.js
│   │   │   ├── liveInterview.controller.js
│   │   │   ├── codingInterview.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── feedback.controller.js
│   │   ├── services/
│   │   │   ├── ai.service.js             # Gemini integration
│   │   │   ├── interviewService.js       # LangChain + Groq orchestration
│   │   │   ├── codingInterviewService.js # Coding challenge AI
│   │   │   ├── redis.service.js          # Redis client
│   │   │   ├── pdfPool.service.js        # Puppeteer cluster
│   │   │   ├── brevo.service.js          # Email service
│   │   │   └── turnstile.service.js      # Bot protection
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   ├── liveInterview.model.js
│   │   │   ├── codingInterview.model.js
│   │   │   ├── transaction.model.js
│   │   │   └── ...
│   │   ├── routes/                  # Express route definitions
│   │   ├── middlewares/             # Auth, validation, rate limiting
│   │   └── configs/
│   │       ├── app.config.js        # Centralized constants
│   │       ├── pricing.json         # Pricing tiers
│   │       └── companyInterviewPrompts.js
│   ├── server.js                    # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/
│   └── deploy.yml                   # Auto-deploy to EC2 on push
├── docker-compose.yml               # Full-stack containerization
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **Redis** (local or cloud)
- API keys for: [Google AI](https://aistudio.google.com/apikey), [Groq](https://console.groq.com/keys), [Deepgram](https://console.deepgram.com)

### 1. Clone the Repository

```bash
git clone https://github.com/IndSumit07/Sumora-AI.git
cd Sumora-AI
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create `server/.env` (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env   # if available, or create manually
```

Start the development server:

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

### 3. Setup the Client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
VITE_LOGO_DEV_TOKEN=your_logo_dev_token
```

Start the development client:

```bash
npm run dev
```

Client runs at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: `3000`) | No |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret for JWT signing | ✅ |
| `GOOGLE_API_KEY` | Google Gemini API key | ✅ |
| `GROQ_API_KEY` | Groq API key (LangChain) | ✅ |
| `GROQ_MODEL` | Groq model override (default: `openai/gpt-oss-120b`) | No |
| `GEMINI_MODEL` | Gemini model override (default: `gemini-2.5-flash`) | No |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `BREVO_API_KEY` | Brevo transactional email key | ✅ |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret | ✅ |
| `REDIS_HOST` | Redis host (default: `localhost`) | No |
| `REDIS_PORT` | Redis port (default: `6379`) | No |
| `NODE_ENV` | `development` or `production` | No |

### Client (`client/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL | ✅ |
| `VITE_DEEPGRAM_API_KEY` | Deepgram API key for voice | ✅ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | ✅ |
| `VITE_LOGO_DEV_TOKEN` | Logo.dev API token | No |

---

## 📡 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register with email, username, password |
| `POST` | `/verify-otp` | Verify email OTP |
| `POST` | `/resend-otp` | Resend verification OTP |
| `POST` | `/login` | Login with email & password |
| `POST` | `/google` | Google OAuth login |
| `POST` | `/forgot-password` | Send password reset OTP |
| `POST` | `/reset-password` | Reset password with OTP |
| `POST` | `/logout` | Clear session cookie |
| `GET` | `/me` | Get current authenticated user |

### Interview (`/api/interview`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Generate AI interview report (Gemini) |
| `GET` | `/` | List user's interview reports |
| `GET` | `/:id` | Get specific interview report |
| `DELETE` | `/:id` | Delete interview report |
| `POST` | `/resume/pdf/:id` | Generate ATS resume PDF |
| `POST` | `/start` | Start live AI interview (job mode) |
| `POST` | `/prepare/start` | Start prepare mode interview |
| `POST` | `/answer` | Submit answer in live interview |
| `POST` | `/end` | End interview & get feedback |
| `POST` | `/analyze-question` | Analyze a specific question |
| `POST` | `/voice-agent-response` | Voice interview turn handler |
| `GET` | `/live-sessions` | List live interview sessions |
| `GET` | `/live-sessions/:id` | Get specific live session |
| `DELETE` | `/live-sessions/:id` | Delete live session |
| `POST` | `/coding/start` | Start coding interview |
| `POST` | `/coding/submit` | Submit code solution |
| `POST` | `/coding/end` | End coding interview |
| `GET` | `/coding/sessions` | List coding sessions |

### Payments (`/api/payment`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/create-order` | Create Razorpay order |
| `POST` | `/verify` | Verify payment & credit tokens |

### Feedback (`/api/feedback`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Submit site feedback |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check (used for cold-start detection) |

---

## 🧠 AI Models & Workflows

### Gemini (`gemini-2.5-flash`)

Used for tasks requiring **structured JSON output** with schema constraints:

- **Interview Report Generation** — Produces match score, 10 technical + 10 behavioral questions, skill gaps, and a preparation plan. Output validated against Zod schemas.
- **Resume PDF Generation** — Generates ATS-friendly HTML that's rendered to A4 PDF via Puppeteer.

### Groq/LangChain (`openai/gpt-oss-120b`)

Used for **low-latency conversational AI** with in-memory chat history:

- **Live Interview Loop** — Maintains per-session chains via `RunnableWithMessageHistory`. Asks one question per turn, adapts difficulty, and probes weak answers.
- **Prepare Mode** — Topic-locked questioning with strict system prompt enforcement.
- **Question Analysis** — Returns structured teaching breakdowns (`why`, `structure`, `sampleAnswer`, `tip`).
- **End Feedback** — Generates technical/communication scores, strengths, weaknesses, and improvement suggestions.

### Deepgram

Used for **real-time voice interactions**:

- Microphone audio streaming → Deepgram agent → backend function call → Groq chain → Deepgram TTS playback.

### Chain Recovery

If the server restarts mid-interview, `recoverChain()` reconstructs the LangChain session from the MongoDB-persisted transcript — no data loss.

---

## 🪙 Token Economy

Users receive **100 free tokens** on signup. Actions cost tokens:

| Action | Token Cost |
|---|---|
| Interview Report Generation | 25 |
| Live Interview (Job Mode) | 20 |
| Prepare Interview | 20 |
| Coding Interview | 35 |
| Resume PDF Generation | 5 |

Insufficient tokens return **HTTP 402**. Tokens are deducted only after successful action initiation.

### Pricing Plans

| Plan | Price (₹) | Tokens |
|---|---|---|
| **Free** | 0 | 100 (on signup) |
| **Starter Pack** | 49 | 200 |
| **Pro Pack** | 199 | 1,000 |

---

## 🚢 Deployment

### Production Architecture

| Component | Host | Details |
|---|---|---|
| **Frontend** | Vercel | Auto-deployed from `client/` |
| **Backend** | AWS EC2 | PM2 managed, auto-deployed via GitHub Actions |
| **Database** | MongoDB Atlas | Cloud-hosted |
| **Cache** | Redis | In-memory rate limiting & caching |

### CI/CD Pipeline

On every push to `main`, the GitHub Actions workflow:

1. SSHs into the EC2 instance
2. Pulls latest code from `main`
3. Installs dependencies
4. Restarts the server via PM2

---

## 🐳 Docker

Run the full stack locally with Docker Compose:

```bash
# From the project root
docker-compose up --build
```

This starts three services:

| Service | Container | Port | Description |
|---|---|---|---|
| **Redis** | `sumora-redis` | `6379` | In-memory cache with AOF persistence |
| **Server** | `sumora-server` | `3000` | Express API with Chromium for PDF gen |
| **Client** | `sumora-client` | `80` | Nginx serving the Vite build |

### Docker Environment

Set these in the root `.env` for Docker Compose:

```env
VITE_API_URL=http://localhost:3000
VITE_DEEPGRAM_API_KEY=your_key
VITE_GOOGLE_CLIENT_ID=your_key
VITE_TURNSTILE_SITE_KEY=your_key
VITE_LOGO_DEV_TOKEN=your_key
```

Server-specific env vars go in `server/.env`.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Development Tips

- Server hot-reloads with **nodemon** (`npm run dev`)
- Client hot-reloads with **Vite** (`npm run dev`)
- The server uses ES modules (`"type": "module"`)
- All configuration constants are centralized in `server/src/configs/app.config.js`

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**Built with ❤️ by [Sumit](https://github.com/IndSumit07)**

[🌐 Live Demo](https://sumoraai.in) · [🐛 Report Bug](https://github.com/IndSumit07/Sumora-AI/issues) · [💡 Request Feature](https://github.com/IndSumit07/Sumora-AI/issues)

</div>
