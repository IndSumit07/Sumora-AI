import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

/* require all the routes here */
import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

const app = express();

/* ── Trust Render's proxy so express-rate-limit reads the real client IP ── */
app.set("trust proxy", 1);

/* ── Security headers ── */
app.use(helmet());

/* ── CORS ── */
const ALLOWED_ORIGINS = [
  "https://www.sumoraai.in",
  "https://sumoraai.in",
  "http://localhost:5173",
  "http://localhost",       // Docker: Nginx serves client on port 80
  "http://localhost:80",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / curl requests (no origin header)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  }),
);

/* ── Body parsing with size limits ── */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(cookieParser());

/* ── Disable fingerprinting ── */
app.disable("x-powered-by");

/* ── Routes ── */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/feedback", feedbackRouter);

/* ── Health check (used by client to detect cold-start) ── */
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

export default app;
