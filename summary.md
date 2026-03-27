# Sumora AI — Launch Documentation

> **Launch Date:** March 27, 2026  
> **Built by:** Sumit Kumar — Full-stack Engineer & AI Enthusiast  
> **Live at:** [sumora.ai](https://sumora.ai)

---

## What is Sumora AI?

**Sumora AI** is an AI-powered career preparation platform that helps job seekers practice mock interviews, analyze their resumes, and prepare smarter — all in one place. Unlike generic interview tools, Sumora adapts to your **exact target role, company, and resume** to give you the most realistic and useful practice experience possible.

The platform uses a **token-based pay-as-you-go model** — no subscriptions, no hidden fees. Buy tokens, use them only when you need them.

---

## The Problem We Solve

Most candidates walk into interviews underprepared — not because they lack talent, but because they lack access to quality practice. Mock interviews with mentors are expensive and hard to schedule. Generic Q&A lists don't reflect the real interview style of your target company. Resume feedback is vague and subjective.

**Sumora AI fixes all three.** In one platform, for a fraction of the cost.

---

## Services & Pricing

Sumora AI offers four core services powered by large language models and voice AI.

| Service | What it does | Token Cost |
|---|---|---|
| **AI Mock Interview** | Live 1-on-1 voice interview with an AI interviewer that adapts to your role, company, and resume | **20 tokens / session** |
| **Interview Preparation** | AI-generated study plans, topic Q&A banks, and voice-based revision sessions | **20 tokens / session** |
| **Resume Analysis** | ATS scoring, keyword gap analysis vs. job description, section-by-section feedback, rewrite suggestions | **25 tokens / analysis** |
| **Performance Stats** | Score trends, topic strength heatmaps, session history and progress tracking | **Free — always** |

### Token Packs (via Razorpay)
Token packs are available for purchase inside the dashboard. Unused tokens **never expire**.

---

## Core Features

### 🎙 AI Mock Interview
- **Company-specific interview styles** — 40 companies across India and Global
- **3-step selection flow**: Choose Company → Role → Setup → Start
- **Resume-adaptive questions** — upload your resume PDF and the AI tailors questions to your actual experience
- **Live voice interview** powered by Deepgram Voice Agent (real-time speech-to-speech)
- **Difficulty levels**: Easy / Medium / Hard
- **Speak modes**: Continuous (speak naturally) or Push-to-talk (hold Space)
- **Automatic 30-minute session limit** with graceful auto-end
- **Detailed post-interview report** with score, strengths, weaknesses, and question-by-question feedback

### 📖 Interview Preparation
- **Subject catalogue**: DSA, OS, DBMS, Computer Networks, System Design, OOP, Web Dev, ML, Cloud & DevOps, Cybersecurity
- **Topic picker**: Select from suggested topics or add custom topics
- **Optional resume upload** for context-aware questions
- **Voice-based prep sessions** — same real-time Deepgram voice agent
- **Session history** — revisit any past preparation session

### 📊 Resume Analysis
- **ATS compatibility score** — know if your resume beats applicant tracking systems
- **Keyword gap analysis** against any job description you paste
- **Section-by-section AI feedback** — Summary, Experience, Skills, Projects, Education
- **Rewrite suggestions** for weak bullet points
- **Overall match score** showing how aligned you are with the target role
- **Powered by Gemini 2.5 Flash** for deep document understanding

### 📈 Performance Analytics
- Score trend graphs across all sessions
- Topic-level strength & weakness breakdown
- Session history with detailed reports
- Company & role performance tracking
- Completely **free** — no tokens required

---

## Supported Companies (40 Total)

### 🇮🇳 India (23 companies)
Tata Consultancy Services · Infosys · Wipro · HCL Technologies · Tech Mahindra · LTIMindtree · Accenture India · Cognizant · Capgemini India · Mphasis · Persistent Systems · Zoho · Paytm · Flipkart · Ola · Swiggy · Zomato · Razorpay · Freshworks · CRED · PhonePe · Delhivery · Meesho

### 🌍 Global (17 companies)
Google · Amazon · Microsoft · Meta · Apple · Netflix · Uber · Airbnb · Stripe · Salesforce · Adobe · Oracle · SAP · IBM · Accenture · Deloitte · McKinsey & Company

> More companies are added regularly. Suggest a company via the in-app feedback button.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| Vite | 8.0 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 7.13 | Client-side routing |
| Framer Motion | 12.38 | Animations & transitions |
| Lucide React | 0.577 | Icon system |
| React Hot Toast | 2.6 | Toast notifications |
| Axios | 1.13 | HTTP client |
| @paper-design/shaders | 0.0.72 | WebGL background shaders |
| Three.js | 0.183 | 3D hero scene |
| Radix UI | latest | Accessible UI primitives |
| Google OAuth | 0.13 | Social login |
| Cloudflare Turnstile | — | Bot protection |
| Vercel Analytics | 2.0 | Page analytics & speed insights |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js (ESM) | 20+ | Runtime |
| Express | 5.2 | API server & routing |
| MongoDB + Mongoose | 9.3 | Primary database |
| JSON Web Tokens | 9.0 | Authentication |
| bcryptjs | 3.0 | Password hashing |
| Helmet | 8.1 | Security headers |
| express-rate-limit | 8.3 | Rate limiting |
| Multer | 2.1 | File uploads (resume PDFs) |
| pdf-parse | 2.4 | Resume text extraction |
| Zod | 4.3 | Request validation |
| ws | 8.19 | WebSocket server (voice proxy) |
| Puppeteer | 24.39 | Report/PDF generation |
| Razorpay SDK | 2.9 | Payment processing |

### AI & Voice Layer
| Service | Purpose |
|---|---|
| **Groq + LLaMA 3.1 70B** (via LangChain) | Powers all mock interview conversations and preparation sessions |
| **Google Gemini 2.5 Flash** | Powers resume analysis, feedback generation, and scoring |
| **Deepgram Voice Agent** | Real-time speech-to-speech for live voice interviews |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting with global CDN |
| **Render** | Backend Node.js server hosting |
| **MongoDB Atlas** | Cloud database |
| **Razorpay** | Payment gateway (India) |
| **Cloudflare Turnstile** | CAPTCHA / bot protection |
| **Google OAuth 2.0** | Social sign-in |

---

## Architecture Overview

```
User Browser
    │
    ├── Vite React SPA (Vercel CDN)
    │       ├── React Router (client-side routing)
    │       ├── AuthContext  (JWT + Google OAuth)
    │       ├── Dashboard Views (Interview, Prepare, Analyze, Stats, Billing)
    │       └── WebSocket Client ←────────────────────────────────┐
    │                                                              │
    └── Express API Server (Render)                               │
            ├── /api/auth       – JWT authentication              │
            ├── /api/interviews – live interview sessions         │
            ├── /api/prepare    – prep session management         │
            ├── /api/resume     – PDF upload & text extraction    │
            ├── /api/analyze    – Gemini resume analysis          │
            ├── /api/payments   – Razorpay token purchase         │
            ├── /api/feedback   – in-app user feedback            │
            └── WebSocket /ws   – Deepgram voice proxy ──────────┘
                    │
                    ├── MongoDB Atlas  (users, sessions, tokens, reports)
                    ├── Groq API       (LLaMA 3.1 70B)
                    ├── Gemini API     (Gemini 2.5 Flash)
                    └── Deepgram API   (Voice Agent)
```

---

## Security & Privacy

- Passwords hashed with **bcryptjs** (cost factor 12)
- JWT tokens with short expiry + HTTP-only cookies for refresh
- **Helmet.js** security headers on every API response
- **Rate limiting** on all auth and AI endpoints to prevent abuse
- **Cloudflare Turnstile** on registration to block bot sign-ups
- Resume PDFs are **parsed server-side and never stored** — only extracted text is kept temporarily in the session
- Users can delete any session or account at any time

---

## Who Is This For?

| User Type | Use Case |
|---|---|
| **Fresh graduates** | Campus placement prep — TCS, Infosys, Wipro, HCL and more |
| **Software engineers** | FAANG/MAANG targeting — Google, Amazon, Meta, Microsoft, Apple |
| **Career switchers** | Entering tech from non-technical backgrounds |
| **Working professionals** | Lateral moves, promotions, or exploring new companies |
| **Self-learners** | Honest, private, judgment-free practice at any hour |

---

## Roadmap

- [ ] Group mock interviews — practice with peers in the same session  
- [ ] Coding round simulator — live coding with AI code review  
- [ ] HR & behavioral round coach — STAR method practice  
- [ ] LinkedIn profile analyzer — beyond just resumes  
- [ ] Mobile app (React Native)  
- [ ] Referral system — earn tokens by inviting friends  
- [ ] Multi-language support — Hindi, Tamil, Telugu interview practice  
- [ ] Mentor marketplace — book sessions with real engineers  

---

## About the Founder

**Sumit Kumar** — Founder & Full-Stack Engineer

Building tools that use cutting-edge LLMs to help developers and job seekers grow faster. Passionate about making expert-level career tools accessible to everyone, not just those who can afford expensive coaching.

- **GitHub:** [github.com/IndSumit07](https://github.com/IndSumit07)
- **LinkedIn:** [linkedin.com/in/sumit-kumar-545737378](https://www.linkedin.com/in/sumit-kumar-545737378/)

---

## 📢 Social Launch Post — Twitter / X

```
🚀 I just launched Sumora AI — and I'm genuinely proud of this one.

Sumora AI is an AI-powered career preparation platform that gives you:

🎙 Live Voice Mock Interviews — 1-on-1 with an AI that adapts to your resume, 
   role & target company (Google, Amazon, TCS, Flipkart + 36 more)

📖 Interview Preparation — AI study plans, topic Q&A & voice-based revision 
   sessions built around your exact role

📊 Resume Analysis — ATS scoring, keyword gap analysis vs the JD, + 
   rewrite suggestions powered by Gemini

📈 Performance Analytics — track your progress across every session. Free.

No subscriptions. Token-based pricing.
20 tokens for an interview or prep session.
25 for a resume analysis.

Built solo: React 19 · Node.js · LLaMA 3.1 · Gemini 2.5 Flash · Deepgram Voice AI

Try it free 👉 sumora.ai

Would love your feedback 🙏

#buildinpublic #SumoraAI #AITools #InterviewPrep #IndianStartup #launch
```

---

## 📣 LinkedIn Launch Post

```
After months of building nights and weekends, I'm launching Sumora AI today.

The problem I wanted to solve is straightforward: most candidates fail interviews 
not because they aren't talented — but because they didn't get enough realistic 
practice. Mentors are expensive. Peer circles are limited. Generic Q&A lists don't 
reflect how Google or Amazon actually interview.

So I built Sumora AI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Here's what it does:

🎙 AI Mock Interviews with live voice
Powered by Deepgram + LLaMA 3.1. The AI adapts questions to YOUR resume and YOUR 
target company. We support 40 companies including TCS, Infosys, Google, Amazon, 
Meta, Flipkart, Razorpay, Zomato, and more.

📖 Interview Preparation
Pick your subjects (DSA, System Design, ML, etc.), choose topics, and have a 
real-time voice conversation with an AI that quizzes you on the spot.

📊 Resume Analysis
Upload your resume + job description. Get an ATS score, keyword gap analysis, and 
section-by-section rewrite suggestions — powered by Gemini 2.5 Flash.

📈 Performance Analytics
Track your score trends, topic strengths, and overall interview readiness over time.
Always free.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pricing: Simple token model. No subscriptions.
• 20 tokens — Mock Interview or Prep Session
• 25 tokens — Resume Analysis
• Analytics — Free, always

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tech I built this with:
→ Frontend: React 19, Vite, Tailwind CSS, Framer Motion
→ Backend: Node.js, Express 5, MongoDB Atlas
→ AI: LLaMA 3.1 70B (Groq + LangChain), Google Gemini 2.5 Flash
→ Voice: Deepgram Voice Agent API
→ Payments: Razorpay
→ Hosting: Vercel (frontend) + Render (backend)

This entire platform was built solo — every line of code, every design decision, 
every API integration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you're preparing for campus placements, FAANG interviews, or just want 
honest, private, judgment-free practice — this is for you.

🔗 sumora.ai

I read every comment and DM. Would genuinely love your feedback. 🙏

#SumoraAI #AIInterview #CareerPrep #BuildInPublic #IndianStartup #LLM 
#Deepgram #Groq #Gemini #ReactJS #NodeJS #Launch #Hiring #JobSearch
```

---

*Last updated: March 27, 2026*
