import { Loader2, Zap, AlertTriangle, PhoneOff, Mic, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

// ── Shared backdrop + card wrapper ─────────────────────────────────────────────

function ModalShell({ children, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[420px]">
        {children}
      </div>
    </div>
  );
}

// ── Token badge ────────────────────────────────────────────────────────────────

function TokenBadge({ label, value, highlight }) {
  return (
    <div className={[
      "flex items-center justify-between px-4 py-3 rounded-2xl border text-sm",
      highlight
        ? "border-[#ea580c]/30 bg-[#ea580c]/8 dark:bg-[#ea580c]/10"
        : "border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a]",
    ].join(" ")}>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-bold ${highlight ? "text-[#ea580c]" : "text-gray-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}

// ── 1. Start Interview Confirm Modal ──────────────────────────────────────────

export function TokenConfirmModal({
  open,
  cost,
  tokens,
  onConfirm,
  onCancel,
  confirming = false,
  serviceName = "Live Interview",
  description = "Your tokens will be deducted when the session begins.",
}) {
  if (!open) return null;

  const safeCost = Number.isFinite(cost) ? cost : 0;
  const safeTokens = Number.isFinite(tokens) ? tokens : 0;
  const remaining = safeTokens - safeCost;
  const hasEnough = safeTokens >= safeCost;

  return (
    <ModalShell onClose={confirming ? undefined : onCancel}>
      <div className="overflow-hidden rounded-3xl border border-gray-200/80 dark:border-[#2a2a2a] bg-white dark:bg-[#111] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">

        {/* Orange glow top strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ea580c] via-orange-400 to-[#ea580c]" />

        {/* Header */}
        <div className="px-7 pt-7 pb-5 relative">
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-[#ea580c]/12 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#ea580c]/15 flex items-center justify-center ring-1 ring-[#ea580c]/20">
              <Mic size={22} className="text-[#ea580c]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ea580c] mb-0.5">
                Token Confirmation
              </p>
              <h2 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight">
                Start {serviceName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Token breakdown */}
        <div className="px-7 pb-5 space-y-2">
          <TokenBadge label="Session cost" value={`${safeCost} tokens`} highlight />
          <TokenBadge label="Your balance" value={`${safeTokens} tokens`} />
          <div className={[
            "flex items-center justify-between px-4 py-3 rounded-2xl border text-sm",
            hasEnough
              ? "border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/15"
              : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/15",
          ].join(" ")}>
            <span className="text-gray-500 dark:text-gray-400">After this session</span>
            <span className={`font-bold ${hasEnough ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {hasEnough ? `${remaining} tokens` : "Insufficient balance"}
            </span>
          </div>
          {!hasEnough && (
            <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1 px-1">
              <AlertTriangle size={12} />
              You need at least {safeCost} tokens to start this session.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="h-12 flex-1 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming || !hasEnough}
            className="h-12 flex-[1.6] rounded-2xl bg-[#ea580c] text-sm font-bold text-white hover:bg-[#d24e0b] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#ea580c]/25"
          >
            {confirming ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Starting…
              </>
            ) : (
              <>
                <Zap size={14} className="fill-white" />
                Use {safeCost} tokens &amp; Start
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── 2. End Interview Confirm Modal ────────────────────────────────────────────

export function EndInterviewModal({
  open,
  onConfirm,
  onCancel,
  ending = false,
}) {
  if (!open) return null;

  return (
    <ModalShell onClose={ending ? undefined : onCancel}>
      <div className="overflow-hidden rounded-3xl border border-gray-200/80 dark:border-[#2a2a2a] bg-white dark:bg-[#111] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">

        {/* Red top strip */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-600" />

        {/* Header */}
        <div className="px-7 pt-7 pb-5 relative">
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-500/12 flex items-center justify-center ring-1 ring-red-500/20">
              <PhoneOff size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-500 mb-0.5">
                End Session
              </p>
              <h2 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight">
                End this interview?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                The session will end and your performance will be analysed. This
                action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Info block */}
        <div className="mx-7 mb-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-3 flex items-start gap-3">
          <Sparkles size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            AI feedback &amp; scores are generated only if you answered{" "}
            <span className="font-bold">at least 5 questions</span>. Ending early
            will show a progress summary instead.
          </p>
        </div>

        {/* Actions */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={ending}
            className="h-12 flex-1 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222] transition-all disabled:opacity-40"
          >
            Keep Going
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={ending}
            className="h-12 flex-[1.4] rounded-2xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
          >
            {ending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Ending…
              </>
            ) : (
              <>
                <PhoneOff size={14} />
                End &amp; Get Results
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Default export for backward-compat (start modal) ──────────────────────────
export default TokenConfirmModal;
