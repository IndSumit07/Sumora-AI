import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ClipboardList, Loader2 } from "lucide-react";
import { useInterview } from "../../../context/InterviewContext";
import toast from "react-hot-toast";

const NewSessionView = () => {
  const [form, setForm] = useState({ title: "", jobDescription: "" });
  const [loading, setLoading] = useState(false);
  const { createSession } = useInterview();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Session title is required");
    if (!form.jobDescription.trim())
      return toast.error("Job description is required");
    setLoading(true);
    try {
      const session = await createSession(
        form.title.trim(),
        form.jobDescription.trim(),
      );
      navigate(`/dashboard/sessions/${session._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.jobDescription.length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          New Interview Session
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 max-w-lg">
          Define the role you&apos;re targeting. You&apos;ll upload your resume
          and generate your AI-powered prep report on the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Session title */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-5">
            <div className="mt-0.5 h-8 w-8 rounded-lg bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
              <FileText size={15} className="text-[#ea580c]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Session Title
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                A short name you&apos;ll recognize in your sessions list
              </p>
            </div>
          </div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Engineer at Stripe"
            maxLength={100}
            required
            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
          />
        </div>

        {/* Job description */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
                <ClipboardList size={15} className="text-[#ea580c]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Job Description
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paste the full job posting — the AI uses this to tailor your
                  report
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium tabular-nums flex-shrink-0 mt-1 ${
                charCount > 900 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {charCount}/1000
            </span>
          </div>
          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            placeholder="Paste the full job description here…"
            maxLength={1000}
            required
            rows={12}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating session…
            </>
          ) : (
            "Create Session →"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewSessionView;
