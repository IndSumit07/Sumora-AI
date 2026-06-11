import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../services/redis.service.js";
import { CONFIG } from "../configs/app.config.js";

// Use Redis store if available, fallback to memory store
function createStore(prefix) {
  try {
    return new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: `rl:${prefix}:`,
    });
  } catch {
    return undefined;
  }
}

// Strict: login, register, OTP verification — brute-force sensitive
export const authLimiter = rateLimit({
  store: createStore("auth"),
  windowMs: CONFIG.rateLimit.AUTH_WINDOW_MS,
  max: CONFIG.rateLimit.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes" },
});

// OTP sending — prevent spam
export const otpLimiter = rateLimit({
  store: createStore("otp"),
  windowMs: CONFIG.rateLimit.OTP_WINDOW_MS,
  max: CONFIG.rateLimit.OTP_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many OTP requests, please try again in 15 minutes" },
});

// General API — loose limit for authenticated endpoints
export const apiLimiter = rateLimit({
  store: createStore("api"),
  windowMs: CONFIG.rateLimit.API_WINDOW_MS,
  max: CONFIG.rateLimit.API_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down" },
});

// AI endpoints — expensive calls, strict per-user limit
export const aiLimiter = rateLimit({
  store: createStore("ai"),
  windowMs: CONFIG.rateLimit.AI_WINDOW_MS,
  max: CONFIG.rateLimit.AI_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "AI request limit reached, please try again in an hour" },
});
