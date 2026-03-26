/**
 * InterviewSetup.jsx
 *
 * Launch screen for live AI interview.
 * Role and job description are taken directly from the session (no repeated form).
 * Requires resume upload before starting the interview.
 */

import { useRef, useState, useSyncExternalStore } from "react";
import { Mic, FileText, Upload, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";

export default function InterviewSetup({ session, onInterviewStart }) {
  const { uploadResume, startInterview } = useInterview();

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const speakMode = useSyncExternalStore(
    (onStoreChange) => {
      document.addEventListener("speakModeChanged", onStoreChange);
      return () =>
        document.removeEventListener("speakModeChanged", onStoreChange);
    },
    () => window.speakMode || "hold",
  );

  // These come directly from the session — no need to show editable fields
  const role = session?.jobTitle || session?.title || "Software Engineer";
  const jobDescription = session?.jobDescription || "";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File must be under 3 MB.");
      return;
    }
    setResumeFile(file);
  };

  const handleStart = async () => {
    if (!resumeFile) {
      toast.error("Resume upload is required.");
      return;
    }

    setLoading(true);
    try {
      const resumeText = await uploadResume(resumeFile);

      const data = await startInterview({
        sessionId: session._id,
        resumeText,
        role,
        jobDescription,
      });

      onInterviewStart({
        interviewId: data.interviewId,
        firstQuestion: data.question,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      {/* ── Hero banner ── */}
      <div className="bg-[#0a0a0a] rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-xl bg-[#ea580c]/20 flex items-center justify-center">
              <Mic size={15} className="text-[#ea580c]" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#ea580c]">
              Live AI Interview
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white leading-snug mb-2">
            {role}
          </h2>
          {jobDescription && (
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {jobDescription}
            </p>
          )}
        </div>
      </div>

      {/* ── What to expect ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          How it works
        </p>
        <ul className="space-y-2.5">
          {[
            "AI asks one focused question at a time",
            "Answer using your microphone or by typing",
            "Questions adapt based on your responses",
            "Receive a full performance report at the end",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
            >
              <CheckCircle2
                size={14}
                className="text-[#ea580c] flex-shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Required resume upload ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Add your resume
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Required — interview cannot start without a resume PDF
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            Required
          </span>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={[
            "border-2 border-dashed rounded-xl px-4 py-5 flex items-center gap-3 cursor-pointer transition-colors",
            resumeFile
              ? "border-[#ea580c]/40 bg-[#ea580c]/5"
              : "border-gray-200 dark:border-[#2a2a2a] hover:border-[#ea580c]/40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className={[
              "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
              resumeFile ? "bg-[#ea580c]/10" : "bg-gray-100 dark:bg-[#2a2a2a]",
            ].join(" ")}
          >
            {resumeFile ? (
              <FileText size={16} className="text-[#ea580c]" />
            ) : (
              <Upload size={16} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>
          <div className="min-w-0">
            {resumeFile ? (
              <>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {resumeFile.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {(resumeFile.size / 1024).toFixed(0)} KB · Click to change
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Click to upload PDF
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  PDF up to 3 MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Speak Mode Settings ── */}
      <div className="bg-white dark:bg-[#161616] rounded-2xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm">
        <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
          Speak Mode
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              window.speakMode = "normal";
              document.dispatchEvent(new Event("speakModeChanged"));
            }}
            className={[
              "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
              speakMode === "normal"
                ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
            ].join(" ")}
          >
            Speak Normally
          </button>
          <button
            type="button"
            onClick={() => {
              window.speakMode = "hold";
              document.dispatchEvent(new Event("speakModeChanged"));
            }}
            className={[
              "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
              speakMode === "hold"
                ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
            ].join(" ")}
          >
            Hold Space to Speak
          </button>
        </div>
      </div>

      {/* ── Start button ── */}
      <button
        type="button"
        onClick={handleStart}
        disabled={loading || !resumeFile}
        className="w-full h-13 py-3.5 rounded-xl bg-[#ea580c] text-sm font-semibold text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Starting interview…</span>
          </>
        ) : (
          <>
            <Mic size={16} />
            <span>Start Interview</span>
          </>
        )}
      </button>
    </div>
  );
}
