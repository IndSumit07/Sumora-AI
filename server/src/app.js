import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

/* require all the routes here */
import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

/* ── Trust Render's proxy so express-rate-limit reads the real client IP ── */
app.set("trust proxy", 1);

/* ── Security headers ── */
app.use(helmet());

/* ── CORS ── */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

/* ── Health check (used by client to detect cold-start) ── */
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

export default app;
