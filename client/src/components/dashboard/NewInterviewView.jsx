import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
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
    if (!title.trim()) { toast.error("Session title is required"); return; }
    if (!jobDescription.trim()) { toast.error("Job description is required"); return; }
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">New Session</h1>
        <p className="mt-1 text-sm text-gray-400">
          Name the role and paste the job description. You'll add your resume on the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        {/* Title */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-sm font-semibold text-gray-900">
              Session Title <span className="text-[#ea580c]">*</span>
            </label>
            <span className={`text-xs tabular-nums ${title.length > 90 ? "text-[#ea580c]" : "text-gray-400"}`}>
              {title.length} / 100
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            A short name for this prep session (e.g. "Google SWE — Summer 2025").
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="Google SWE — Summer 2025"
            required
            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
          />
        </div>

        {/* Job Description */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-sm font-semibold text-gray-900">
              Job Description <span className="text-[#ea580c]">*</span>
            </label>
            <span className={`text-xs tabular-nums ${jobDescription.length > 950 ? "text-[#ea580c]" : "text-gray-400"}`}>
              {jobDescription.length} / 1000
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Paste the full job posting including required skills and responsibilities.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value.slice(0, 1000))}
            placeholder="Senior React Developer — Required: 4+ years experience, TypeScript, REST APIs..."
            rows={6}
            required
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating session…
            </>
          ) : (
            <><Sparkles size={16} /> Continue to Report Setup</>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewInterviewView;
