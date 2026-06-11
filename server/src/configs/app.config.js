/**
 * Unified application configuration.
 * Centralizes all magic numbers, limits, costs, and timing constants.
 */

export const CONFIG = {
  // ── Token Economy ───────────────────────────────────────────────────────────
  tokens: {
    FREE_ON_SIGNUP: 100,
    REPORT_GENERATION: 25,
    RESUME_PDF: 5,
    LIVE_INTERVIEW: 20,
    PREPARE_INTERVIEW: 20,
  },

  // ── Interview Settings ──────────────────────────────────────────────────────
  interview: {
    DURATION_MS: 30 * 60 * 1000, // 30 minutes
    MIN_ANSWERS_FOR_ANALYSIS: 5,
    DIFFICULTIES: ["easy", "medium", "hard"],
    DEFAULT_DIFFICULTY: "medium",
  },

  // ── Text / Input Limits ───────────────────────────────────────────────────
  limits: {
    RESUME_TEXT_MAX: 8000,
    JOB_DESCRIPTION_MAX: 5000,
    SELF_DESCRIPTION_MAX: 2000,
    ROLE_MAX_LENGTH: 150,
    SUBJECT_MAX_LENGTH: 100,
    TOPIC_MAX_LENGTH: 200,
    COMPANY_KEY_MAX_LENGTH: 80,
    COMPANY_NAME_MAX_LENGTH: 120,
    COMPANY_WEBSITE_MAX_LENGTH: 300,
    COMPANY_PROMPT_TITLE_MAX_LENGTH: 150,
    COMPANY_PROMPT_DESCRIPTION_MAX_LENGTH: 2500,
    FEEDBACK_COMMENT_MAX_LENGTH: 1000,
    USERNAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
  },

  // ── File Upload ─────────────────────────────────────────────────────────────
  upload: {
    MAX_FILE_SIZE_BYTES: 3 * 1024 * 1024, // 3 MB
    ALLOWED_MIMETYPES: ["application/pdf"],
  },

  // ── Pagination ──────────────────────────────────────────────────────────────
  pagination: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // ── Rate Limiting ───────────────────────────────────────────────────────────
  rateLimit: {
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX_REQUESTS: 10,
    OTP_WINDOW_MS: 15 * 60 * 1000,
    OTP_MAX_REQUESTS: 5,
    API_WINDOW_MS: 15 * 60 * 1000,
    API_MAX_REQUESTS: 100,
    AI_WINDOW_MS: 60 * 60 * 1000, // 1 hour
    AI_MAX_REQUESTS: 20,
  },

  // ── Payments ────────────────────────────────────────────────────────────────
  payments: {
    REFUND_WINDOW_MS: 1 * 60 * 1000, // 1 minute
    CURRENCY: "INR",
    PAISE_MULTIPLIER: 100,
  },

  // ── AI / LLM ──────────────────────────────────────────────────────────────
  ai: {
    GROQ_MODEL: "llama-3.1-8b-instant",
    GEMINI_MODEL: "gemini-2.5-flash",
    MAX_RETRIES: 2,
    TEMPERATURE: 0.7,
  },

  // ── PDF Generation ──────────────────────────────────────────────────────────
  pdf: {
    FORMAT: "A4",
    MARGIN_TOP: "10mm",
    MARGIN_BOTTOM: "10mm",
    MARGIN_LEFT: "10mm",
    MARGIN_RIGHT: "10mm",
    SCALE: 0.85,
    PAGE_RANGES: "1",
  },

  // ── External APIs ───────────────────────────────────────────────────────────
  external: {
    LINKEDIN_GUEST_JOB_TIMEOUT_MS: 10000,
    LOGO_DEV_BASE_URL: "https://img.logo.dev",
  },
};

/**
 * Helper to safely parse pagination query params.
 */
export function parsePagination(query) {
  const page = Math.max(
    1,
    parseInt(query?.page, 10) || CONFIG.pagination.DEFAULT_PAGE,
  );
  const limit = Math.min(
    CONFIG.pagination.MAX_LIMIT,
    Math.max(1, parseInt(query?.limit, 10) || CONFIG.pagination.DEFAULT_LIMIT),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
