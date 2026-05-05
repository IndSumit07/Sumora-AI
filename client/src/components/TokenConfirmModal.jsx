import { Loader2, Zap } from "lucide-react";

export default function TokenConfirmModal({
  open,
  cost,
  tokens,
  onConfirm,
  onCancel,
  confirming = false,
}) {
  if (!open) return null;

  const safeCost = Number.isFinite(cost) ? cost : 0;
  const safeTokens = Number.isFinite(tokens) ? tokens : 0;
  const hasEnoughTokens = safeTokens >= safeCost;
  const summary = safeCost > 0 ? `${safeCost} tokens` : "Free";

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm token usage"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={confirming ? undefined : onCancel}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] shadow-2xl">
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute -top-20 -right-16 h-40 w-40 rounded-full bg-[#ea580c]/15 blur-3xl pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#ea580c]/15 text-[#ea580c] flex items-center justify-center flex-shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Use tokens to start?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                This interview will deduct {summary} immediately when you
                start.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          <div className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Cost</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {summary}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-500 dark:text-gray-400">
                Available
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {safeTokens} tokens
              </span>
            </div>
          </div>
          {!hasEnoughTokens && (
            <p className="mt-3 text-xs text-red-500">
              Not enough tokens to start this interview.
            </p>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="h-11 flex-1 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#191919] text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-[#444] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming || !hasEnoughTokens}
            className="h-11 flex-1 rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {confirming ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Starting...
              </>
            ) : (
              `Use ${summary}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
