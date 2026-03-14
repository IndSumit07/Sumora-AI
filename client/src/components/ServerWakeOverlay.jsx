import { useEffect, useState } from "react";

// ─── PREVIEW MODE ────────────────────────────────────────────────────────────
// Set to true to always show the overlay (ignores sessionStorage + uses a fake
// offline URL so the spinner stays up). Revert to false before deploying.
const PREVIEW_MODE = false;
// ─────────────────────────────────────────────────────────────────────────────

const RETRY_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 20; // ~60s total

const ServerWakeOverlay = () => {
  const [visible, setVisible] = useState(
    () => PREVIEW_MODE || !sessionStorage.getItem("server_awake"),
  );
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const dismiss = () => {
      if (cancelled) return;
      if (!PREVIEW_MODE) sessionStorage.setItem("server_awake", "1");
      setFadeOut(true);
      setTimeout(() => setVisible(false), 700);
    };

    const wake = async () => {
      let attempts = 0;
      // In preview mode point to a route that 404s so the overlay stays up
      const url = PREVIEW_MODE ? "/api/__preview_offline__" : "/api/health";
      while (attempts < MAX_ATTEMPTS && !cancelled) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            dismiss();
            return;
          }
        } catch {
          // server still cold — keep retrying
        }
        attempts++;
        await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
      }
      dismiss();
    };

    wake();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Full-screen video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/overlay.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ── Status badge — top right ── */}
      <div className="absolute right-6 top-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 shadow-2xl backdrop-blur-md">
        {/* Spinner */}
        <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold tracking-wide text-white">
            Waking up the server
          </p>
          <p className="text-xs text-white/55">Please wait a moment…</p>
        </div>
      </div>

      {/* ── Preview-only close button — top left ── */}
      {PREVIEW_MODE && (
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(() => setVisible(false), 700);
          }}
          className="absolute left-6 top-6 flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/60 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
        >
          ✕ Close preview
        </button>
      )}

      {/* ── Centered bottom ── */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-16">
        {/* Animated dots */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#ea580c] [animation-delay:0s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#ea580c] [animation-delay:0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#ea580c] [animation-delay:0.30s]" />
        </div>
        <p className="text-xs uppercase tracking-widest text-white/40">
          sumora.ai
        </p>
      </div>
    </div>
  );
};

export default ServerWakeOverlay;
