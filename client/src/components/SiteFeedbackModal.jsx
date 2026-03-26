import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, MessageSquare, X } from "lucide-react";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default function SiteFeedbackModal({ open, onClose, user }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const name = useMemo(() => (user?.username || "").trim(), [user?.username]);
  const email = useMemo(() => (user?.email || "").trim(), [user?.email]);

  useEffect(() => {
    if (!open) return;
    setSubject("");
    setMessage("");
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error("Subject is required.");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/feedback", {
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success("Thanks! Your feedback has been submitted.");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sumora AI" className="h-8 w-auto" />
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Product Feedback
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Help us improve Sumora AI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition-colors"
            aria-label="Close feedback form"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                readOnly
                className="h-10 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] px-3 text-sm text-gray-700 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="h-10 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] px-3 text-sm text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
              placeholder="Write a short subject"
              className="h-10 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1500}
              rows={6}
              placeholder="Tell us what we should improve, what feels broken, or what feature you want next."
              className="w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none resize-none"
            />
            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 text-right">
              {message.length}/1500
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-[#ea580c]" />
              We read every feedback submission.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-4 rounded-xl bg-[#ea580c] text-white text-sm font-medium hover:bg-[#d24e0b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
