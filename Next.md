# Sumora AI: Migration Plan from MERN to Next.js + Supabase

This document outlines the complete migration plan for moving the Sumora AI project from a traditional MERN (MongoDB, Express, React, Node.js) stack to a modern **Next.js** architecture powered by **Supabase** and **TypeScript**.

## 1. Tech Stack Overview

### Core Framework
*   **Next.js (App Router):** Replaces both Vite (Client) and Express (Server). We will use the `src/app` directory for routing, combining frontend pages and backend API routes in a single unified codebase.
*   **React 19:** Utilizing Server Components and Server Actions to reduce client-side JavaScript.
*   **TypeScript:** Strict typing across the entire stack for better maintainability and developer experience.

### Database & Authentication (Replacing MongoDB & JWT)
*   **Supabase (PostgreSQL):** Replaces MongoDB (`mongoose`). Provides a highly scalable relational database.
*   **Supabase Auth:** Replaces custom `jsonwebtoken` + `bcryptjs` + `@react-oauth/google`. Supabase handles email/password, magic links, and Google OAuth out of the box.
*   **Supabase Storage:** Replaces local/S3 `multer` uploads for storing PDFs or user-generated files.

### Frontend Libraries (Migrated from existing package.json)
*   **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`, `class-variance-authority` (shadcn/ui style).
*   **Animations:** `framer-motion`, `gsap`, `@gsap/react`, `lenis` (smooth scrolling).
*   **3D Graphics:** `three`, `@paper-design/shaders`.
*   **UI Components:** `@monaco-editor/react` (Code editor), `lucide-react` (Icons), `react-hot-toast` (Notifications), `react-turnstile` (Cloudflare CAPTCHA), Radix UI primitives.

### Backend Capabilities (Moved to Next.js Server Actions / API Routes)
*   **AI Integration:** `@google/genai`, `@google/generative-ai`, `@langchain/core`, `@langchain/groq`.
*   **Speech-to-Text:** `@deepgram/sdk`.
*   **Payments:** `razorpay` (Webhooks handled via Next.js API Routes).
*   **Data Processing:** `pdf-parse`, `puppeteer`, `puppeteer-cluster` (Must be run on Next.js server-side / API Routes).
*   **Caching/Rate Limiting:** `ioredis` (Upstash Redis is recommended for serverless Next.js environments) and `@upstash/ratelimit`.

---

## 2. Project Structure

We will adopt a `src`-based Next.js project structure for better organization.

```text
sumora-ai-next/
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── actions/            # Next.js Server Actions (Database mutations, AI calls)
│   │   ├── auth.ts
│   │   ├── ai.ts
│   │   └── payments.ts
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Route group for auth pages (login, register)
│   │   ├── dashboard/      # Dashboard routes
│   │   ├── api/            # API Routes (Webhooks, heavy processing like Puppeteer)
│   │   │   ├── razorpay/webhook/route.ts
│   │   │   └── scrape/route.ts
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/         # React Components
│   │   ├── ui/             # Reusable base components (buttons, inputs)
│   │   ├── 3d/             # Three.js / Shader components
│   │   └── editor/         # Monaco editor wrapper
│   ├── hooks/              # Custom React hooks (e.g., useSupabase)
│   ├── lib/                # Library initializations
│   │   ├── supabase/       # Supabase client configurations
│   │   │   ├── client.ts   # Browser client
│   │   │   └── server.ts   # Server-only client
│   │   ├── redis.ts        # Redis client
│   │   ├── razorpay.ts     # Razorpay initialization
│   │   └── ai.ts           # Google GenAI / LangChain setup
│   ├── types/              # TypeScript definitions & Supabase DB types
│   │   └── index.ts
│   └── utils/              # Helper functions (date formatting, text parsing)
├── .env.local              # Environment variables
├── middleware.ts           # Next.js Middleware (Route protection & Auth state)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 3. Migration Steps

### Step 1: Initialize Project & Install Dependencies
Run the following to bootstrap the project:
```bash
npx create-next-app@latest sumora-ai-next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
Install necessary libraries:
```bash
# Supabase & Auth
npm install @supabase/supabase-js @supabase/ssr

# UI & Animations
npm install framer-motion gsap @gsap/react lenis three @paper-design/shaders @monaco-editor/react lucide-react react-hot-toast clsx tailwind-merge class-variance-authority

# AI & Processing
npm install @google/genai @langchain/core @langchain/groq @deepgram/sdk pdf-parse puppeteer razorpay

# Redis (Serverless alternative to ioredis for Next.js)
npm install @upstash/redis @upstash/ratelimit
```

### Step 2: Database Migration (MongoDB to PostgreSQL)
1.  **Analyze MongoDB Schemas:** Review your `mongoose` schemas in the MERN backend.
2.  **Design Relational Schema:** Map MongoDB collections (e.g., Users, Projects, Chats) to PostgreSQL tables in the Supabase Dashboard.
3.  **Generate Types:** Use the Supabase CLI to generate TypeScript types from your Postgres schema:
    ```bash
    npx supabase gen types typescript --project-id abcdefghijklm > src/types/supabase.ts
    ```

### Step 3: Authentication Migration
1.  **Replace JWT/Bcrypt:** Move away from custom Express authentication.
2.  **Supabase Auth Setup:** Use `@supabase/ssr` to handle session management via cookies.
3.  **Middleware:** Create `src/middleware.ts` to protect routes (like `/dashboard`) checking for a valid Supabase session before rendering the page.

### Step 4: Backend Logic to Server Actions/API Routes
1.  **Simple CRUD & AI:** Migrate Express routes handling database reads/writes and lightweight AI calls to **Next.js Server Actions** (`src/actions`). This allows you to call backend functions directly from client components with end-to-end type safety.
2.  **Heavy Processing (Puppeteer/PDF):** Next.js Serverless Functions have timeouts (e.g., 10-60s on Vercel). If Puppeteer takes longer, consider deploying it as a separate background worker, or keep it in a standard Next.js API Route (`src/app/api/.../route.ts`) if it's fast enough.
3.  **Webhooks:** Migrate Razorpay webhook handlers to Next.js API routes (`src/app/api/webhooks/razorpay/route.ts`) and ensure signature verification remains intact.

### Step 5: Frontend Migration
1.  **React Router to App Router:** Replace `<Route>` and `<Routes>` from `react-router-dom` with Next.js folder-based routing (`src/app/page.tsx`, `src/app/dashboard/page.tsx`).
2.  **Component Migration:** Move Vite components to `src/components`. Ensure components using hooks (`useState`, `useRef`, GSAP) have the `"use client"` directive at the top of the file, as Next.js defaults to Server Components.
3.  **Data Fetching:** Replace `axios` + `useEffect` data fetching with native Next.js server-side rendering (fetching data directly inside `page.tsx` server components) or React Query if client-side caching is heavily needed.

## 4. Supabase Setup Details

We will use the `@supabase/ssr` package for secure cookie-based auth in Next.js App Router.

**`src/lib/supabase/server.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
```

## 5. Potential Gotchas & Considerations
*   **Puppeteer in Serverless:** Running Puppeteer inside a serverless environment (like Vercel API routes) requires specific binaries (e.g., `@sparticuz/chromium`) and can hit timeout limits. You might need to host the scraping service separately (e.g., on Render or Railway) or use a cloud scraping API if Vercel limits are reached.
*   **WebSockets (`ws`):** If your MERN app heavily relies on real-time sockets (`ws`), Supabase Realtime covers most database change subscriptions and presence features. If you need raw WebSockets for custom logic, Serverless Next.js doesn't support long-running Socket.io/WS servers well, so you'd use Supabase Realtime Channels or an external service like Pusher.
*   **"use client":** Remember that all MERN React components are essentially client components. In Next.js, you must add `"use client"` to the top of any file using interactivity (onClick, GSAP, Monaco editor, Framer Motion).

---
*End of Migration Plan*
