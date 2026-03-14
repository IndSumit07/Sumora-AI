import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useInterview } from "../../context/InterviewContext";
import toast from "react-hot-toast";

const NewInterviewView = () => {
  const { createSession } = useInterview();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Session title is required");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Job description is required");
      return;
    }
    setLoading(true);
    try {
      const session = await createSession(title.trim(), jobDescription.trim());
      navigate(`/dashboard/sessions/${session._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-[#222]">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          # New Session
        </h1>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Create Session
          </h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 dark:text-gray-400">
            Name the role and paste the job description to get started. You'll
            add your resume on the next step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Session Title <span className="text-[#ea580c]">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${title.length > 90 ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                {title.length} / 100
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              A short name for this prep session (e.g. "Google SWE — Summer
              2025").
            </p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="Google SWE — Summer 2025"
              required
              className="h-12 w-full rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] px-4 text-sm text-gray-800 dark:text-gray-200 outline-none transition-all placeholder:text-gray-500 dark:text-gray-600 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
            />
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Job Description <span className="text-[#ea580c]">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${jobDescription.length > 950 ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                {jobDescription.length} / 1000
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Paste the full job posting including required skills and
              responsibilities.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value.slice(0, 1000))}
              placeholder="Senior React Developer — Required: 4+ years experience, TypeScript, REST APIs..."
              rows={8}
              required
              className="w-full resize-none rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] px-4 py-3 text-sm text-gray-800 dark:text-gray-200 outline-none transition-all placeholder:text-gray-500 dark:text-gray-600 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-[#ea580c] text-sm font-semibold text-gray-900 dark:text-white transition-all hover:bg-[#d24e0b] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating session…
              </>
            ) : (
              <>
                Continue to Setup <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInterviewView;
