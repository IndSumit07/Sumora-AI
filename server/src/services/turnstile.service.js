const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      success: false,
      error: "Turnstile secret key is not configured",
    };
  }

  if (!token || typeof token !== "string") {
    return {
      success: false,
      error: "Missing Turnstile token",
    };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    if (remoteip) {
      body.append("remoteip", remoteip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await response.json();
    return {
      success: Boolean(data?.success),
      error: Array.isArray(data?.["error-codes"])
        ? data["error-codes"].join(", ")
        : undefined,
    };
  } catch (error) {
    console.error("Turnstile verify error:", error);
    return {
      success: false,
      error: "Turnstile verification failed",
    };
  }
}
