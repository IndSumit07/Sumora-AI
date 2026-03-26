import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Plus,
  Mic,
  Loader2,
  Upload,
  X,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Trash2,
  Link,
  CheckCircle2,
  Radio,
  MessageSquare,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import {
  COMPANY_INTERVIEW_PROFILES,
  getCompanyProfileByKey,
  buildVoiceCompanyStylePrompt,
} from "../../../shared/companyInterviewProfiles";
import InterviewChat from "./InterviewChat";
import InterviewFeedback from "./InterviewFeedback";
import InterviewHistoryDetail from "./InterviewHistoryDetail";
import VoiceInterviewAgent from "./VoiceInterviewAgent";

// ── Score / status badge ──────────────────────────────────────────────────────

const statusBadge = (interview) => {
  if (interview.status !== "completed")
    return {
      label: "In Progress",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400",
    };
  const s = interview.score ?? 0;
  if (s <= 0)
    return {
      label: "Completed",
      cls: "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300",
    };
  if (s >= 70) return { label: "Strong", cls: "bg-green-50 text-green-700" };
  if (s >= 45) return { label: "Good", cls: "bg-amber-50 text-amber-700" };
  return { label: "Needs Work", cls: "bg-red-50 text-red-600" };
};

// ── History card ──────────────────────────────────────────────────────────────

const InterviewCard = ({ interview, active, onClick, onDelete }) => {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const { label, cls } = statusBadge(interview);

  return (
    <div
      role="button"
      onClick={onClick}
      className={[
        "relative group w-full text-left px-3 py-3 rounded-xl border transition-all cursor-pointer",
        active
          ? "border-[#ea580c]/50 bg-[#ea580c]/8 dark:bg-[#ea580c]/10"
          : "border-transparent hover:border-gray-200 dark:hover:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(interview._id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        title="Delete"
      >
        <Trash2 size={12} />
      </button>

      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1 pr-5">
        {interview.role || "Mock Interview"}
      </p>
      {interview.companyName && interview.companyName !== "General" && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mb-1.5 pr-5 flex items-center gap-1">
          <Building2 size={10} />
          {interview.companyName}
        </p>
      )}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Calendar size={10} />
          {date}
        </span>
        <div className="flex items-center gap-1.5">
          {interview.difficulty && interview.difficulty !== "medium" && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                interview.difficulty === "easy"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              }`}
            >
              {interview.difficulty}
            </span>
          )}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}
          >
            {interview.status === "completed"
              ? `${interview.score ?? 0} · `
              : ""}
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

const CompanyOptionCard = ({ profile, active, onSelect }) => {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(profile.key)}
      className={[
        "rounded-xl border p-3 text-left transition-all",
        active
          ? "border-[#ea580c] bg-[#ea580c]/10"
          : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] hover:border-[#ea580c]/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className="relative h-8 w-8 rounded-lg bg-gray-100 dark:bg-[#242424] flex items-center justify-center overflow-hidden">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            {initials}
          </span>
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={`${profile.name} logo`}
              className="absolute inset-0 h-full w-full object-contain bg-white"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {profile.name}
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
        {profile.styleSummary}
      </p>
    </button>
  );
};

// ── Setup form ────────────────────────────────────────────────────────────────

const SetupForm = ({ onStarted }) => {
  const { uploadResume, startInterview } = useInterview();
  const [step, setStep] = useState(1); // 1: Company Select, 2: Start Interview
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCompanyKey, setSelectedCompanyKey] = useState("general");
  const [useCustomCompany, setUseCustomCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customCompanyWebsite, setCustomCompanyWebsite] = useState("");
  const [customCompanyTitle, setCustomCompanyTitle] = useState("");
  const [customCompanyDescription, setCustomCompanyDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewMode, setInterviewMode] = useState("interactive"); // "voice" | "text"
  const fileRef = useRef(null);
  const selectedCompanyProfile = getCompanyProfileByKey(selectedCompanyKey);
  const customCompanyReady =
    !useCustomCompany ||
    (customCompanyName.trim().length > 1 &&
      customCompanyDescription.trim().length > 20);

  // Sync external store to force re-render when window.speakMode changes
  const speakMode = useSyncExternalStore(
    (onStoreChange) => {
      document.addEventListener("speakModeChanged", onStoreChange);
      return () =>
        document.removeEventListener("speakModeChanged", onStoreChange);
    },
    () => window.speakMode || "hold",
  );
  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF accepted.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Resume must be under 3 MB.");
      return;
    }
    setResumeFile(file);
    setUploadLoading(true);
    try {
      const text = await uploadResume(file);
      setResumeText(text);
      toast.success("Resume parsed.");
    } catch {
      toast.error("Failed to parse resume.");
      setResumeFile(null);
      setResumeText("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleStart = async () => {
    let finalRole = role;
    let finalJobDesc = jobDescription;

    if (!useCustomCompany) {
      finalRole = selectedCompanyProfile.defaultRole || "Software Developer";
      finalJobDesc =
        selectedCompanyProfile.defaultJobDescription ||
        selectedCompanyProfile.styleSummary;
    }

    if (!finalRole.trim()) {
      toast.error("Role is required.");
      return;
    }
    if (!finalJobDesc.trim()) {
      toast.error("Job description is required.");
      return;
    }
    if (!resumeText.trim()) {
      toast.error("Resume upload is required.");
      return;
    }

    if (useCustomCompany && !customCompanyName.trim()) {
      toast.error("Custom company name is required.");
      return;
    }
    if (useCustomCompany && customCompanyDescription.trim().length < 20) {
      toast.error(
        "Custom interview description should be at least 20 characters.",
      );
      return;
    }

    const companyProfile = useCustomCompany
      ? {
          type: "custom",
          name: customCompanyName.trim(),
          website: customCompanyWebsite.trim(),
          title:
            customCompanyTitle.trim() ||
            `${customCompanyName.trim()} Interview Style`,
          description: customCompanyDescription.trim(),
        }
      : {
          type: "preset",
          key: selectedCompanyProfile.key,
          name:
            selectedCompanyProfile.name.split(" @")[1] ||
            selectedCompanyProfile.name,
        };

    setStartLoading(true);
    try {
      const { interviewId, question, startedAt } = await startInterview({
        role: finalRole,
        jobDescription: finalJobDesc,
        resumeText,
        difficulty,
        companyProfile,
      });
      onStarted({
        interviewId,
        firstQuestion: question,
        role: finalRole,
        jobDescription: finalJobDesc,
        resumeText,
        difficulty,
        companyProfile,
        companyName: useCustomCompany
          ? customCompanyName.trim()
          : selectedCompanyProfile.name.split(" @")[1] ||
            selectedCompanyProfile.name,
        startedAt,
        mode: interviewMode,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setStartLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-[#ea580c]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mock Interview Companies
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Select a company to start your tailored mock interview
              immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPANY_INTERVIEW_PROFILES.map((profile) => {
            const companyNameOnly =
              profile.name.split(" @ ")[1] || profile.name;
            const initials = companyNameOnly.substring(0, 2).toUpperCase();

            return (
              <button
                key={profile.key}
                type="button"
                onClick={() => {
                  setSelectedCompanyKey(profile.key);
                  setUseCustomCompany(false);
                  setStep(2);
                }}
                className="group rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 text-left transition-all hover:border-[#ea580c]/50 hover:shadow-md dark:hover:shadow-[#ea580c]/5"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="relative h-12 w-12 rounded-xl bg-gray-100 dark:bg-[#242424] flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#333]">
                    <span className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                      {initials}
                    </span>
                    {profile.logoUrl && (
                      <img
                        src={profile.logoUrl}
                        alt={`${companyNameOnly} logo`}
                        className="absolute inset-0 h-full w-full object-contain bg-white p-1.5"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-[#ea580c] transition-colors">
                      {profile.name}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      {profile.defaultRole || "Software Developer"}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2">
                    {profile.defaultJobDescription || profile.styleSummary}
                  </p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setUseCustomCompany(true);
              setRole("");
              setJobDescription("");
              setStep(2);
            }}
            className="rounded-2xl border border-dashed border-gray-300 dark:border-[#333] bg-gray-50/50 dark:bg-[#161616]/50 p-5 text-left transition-all hover:border-[#ea580c]/40 hover:text-[#ea580c] flex flex-col items-center justify-center min-h-[160px] gap-3 text-gray-500 dark:text-gray-400 group"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-[#2a2a2a] group-hover:bg-[#ea580c]/10 flex items-center justify-center transition-colors">
              <Plus size={20} className="group-hover:text-[#ea580c]" />
            </div>
            <span className="text-sm font-semibold">Add Custom Company</span>
            <span className="text-[11px] text-center max-w-[200px]">
              Define your own role, company name, and specific interview
              requirements.
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep(1)}
          className="h-8 w-8 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="h-8 w-8 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
          <Mic size={16} className="text-[#ea580c]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {useCustomCompany
              ? "Custom Mock Interview"
              : selectedCompanyProfile.name}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {useCustomCompany
              ? "Fill in the details to start."
              : "Review details and upload your resume to begin."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {useCustomCompany ? (
          <div className="rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Custom Company Details
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={customCompanyName}
                  onChange={(e) => setCustomCompanyName(e.target.value)}
                  placeholder="Company Name (e.g. ByteBridge AI)"
                  maxLength={120}
                  className="h-10 w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none"
                />
                <input
                  type="url"
                  value={customCompanyWebsite}
                  onChange={(e) => setCustomCompanyWebsite(e.target.value)}
                  placeholder="Company Careers Link (optional)"
                  maxLength={300}
                  className="h-10 w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none"
                />
              </div>
              <input
                type="text"
                value={customCompanyTitle}
                onChange={(e) => setCustomCompanyTitle(e.target.value)}
                placeholder="Interview Style Title (optional)"
                maxLength={150}
                className="h-10 w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none"
              />
              <textarea
                value={customCompanyDescription}
                onChange={(e) => setCustomCompanyDescription(e.target.value)}
                placeholder="Describe how this company usually interviews. Mention style, depth, question types, and what interviewers prioritize."
                rows={4}
                maxLength={1500}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 py-2.5 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none resize-none"
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Minimum 20 characters to ensure reliable prompt quality.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-[#2a2a2a]">
              <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 mt-2">
                Role / Position
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Senior Frontend Engineer"
                maxLength={150}
                className="h-10 w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements here..."
                rows={4}
                maxLength={5000}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] px-3 py-2.5 text-xs bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-xl bg-gray-100 dark:bg-[#242424] flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#333]">
                <span className="text-[14px] font-bold text-gray-500 dark:text-gray-400">
                  {(
                    selectedCompanyProfile.name.split(" @")[1] ||
                    selectedCompanyProfile.name
                  )
                    .substring(0, 2)
                    .toUpperCase()}
                </span>
                {selectedCompanyProfile.logoUrl && (
                  <img
                    src={selectedCompanyProfile.logoUrl}
                    alt={`${selectedCompanyProfile.name} logo`}
                    className="absolute inset-0 h-full w-full object-contain bg-white p-1.5"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Company
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedCompanyProfile.name.split(" @")[1] ||
                    selectedCompanyProfile.name}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-[#2a2a2a]">
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 mt-2">
                Target Role
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {selectedCompanyProfile.defaultRole || "Software Developer"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3.5 border border-gray-100 dark:border-[#2a2a2a]">
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                Job Description & Focus
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedCompanyProfile.defaultJobDescription ||
                  selectedCompanyProfile.styleSummary}
              </p>
            </div>
          </div>
        )}

        {/* Resume (required) */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Resume <span className="normal-case font-normal">(required)</span>
          </p>
          {resumeFile ? (
            <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <FileText
                size={14}
                className="text-green-600 dark:text-green-400 flex-shrink-0"
              />
              <span className="text-sm text-green-700 dark:text-green-300 truncate flex-1">
                {resumeFile.name}
              </span>
              {uploadLoading ? (
                <Loader2
                  size={14}
                  className="animate-spin text-green-600 flex-shrink-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setResumeText("");
                  }}
                  className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl border border-dashed border-gray-300 dark:border-[#333] text-sm text-gray-500 dark:text-gray-400 hover:border-[#ea580c]/60 hover:text-[#ea580c] transition-all w-full"
            >
              <Upload size={14} /> Upload Resume PDF
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Interview Mode */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Interview Mode
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInterviewMode("interactive")}
              className={[
                "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-1",
                interviewMode === "interactive"
                  ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              <Radio size={14} />
              <span>Interactive</span>
            </button>
            <button
              type="button"
              onClick={() => setInterviewMode("analytic")}
              className={[
                "flex-1 h-11 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-1",
                interviewMode === "analytic"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
              ].join(" ")}
            >
              <MessageSquare size={14} />
              <span>Analytic</span>
            </button>
          </div>
        </div>

        {/* Speak Mode Settings (Only visible for interactive mode) */}
        {interviewMode === "interactive" && (
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
              Speak Mode
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.speakMode = "normal";
                  // To trigger a re-render if needed, you could add state,
                  // or rely on VoiceInterviewAgent to pick this up.
                  document.dispatchEvent(new Event("speakModeChanged"));
                }}
                className={[
                  "flex-1 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
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
                  "flex-1 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2",
                  speakMode === "hold"
                    ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                Hold Space to Speak
              </button>
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            Difficulty
          </label>
          <div className="flex gap-2">
            {[
              {
                value: "easy",
                label: "Easy",
                active:
                  "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
              },
              {
                value: "medium",
                label: "Medium",
                active:
                  "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
              },
              {
                value: "hard",
                label: "Hard",
                active:
                  "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
              },
            ].map(({ value, label, active }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDifficulty(value)}
                className={[
                  "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all",
                  difficulty === value
                    ? active
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={
            startLoading ||
            uploadLoading ||
            !resumeText.trim() ||
            (useCustomCompany
              ? !role.trim() || !jobDescription.trim() || !customCompanyReady
              : false)
          }
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-all focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {startLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Starting interview…
            </>
          ) : (
            <>
              <Mic size={14} /> Start Interview
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── Empty right-panel state ───────────────────────────────────────────────────

const EmptyPanel = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <div className="h-14 w-14 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center mb-4">
      <Mic size={24} className="text-[#ea580c]" />
    </div>
    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
      No interview selected
    </h2>
    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 max-w-xs">
      Select a past interview from the list or start a new one.
    </p>
    <button
      type="button"
      onClick={onNew}
      className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
    >
      <Plus size={14} /> New Interview
    </button>
  </div>
);

// ── Main InterviewView ────────────────────────────────────────────────────────

export default function InterviewView() {
  const { getAllLiveInterviews, getLiveInterviewById, deleteLiveInterview } =
    useInterview();

  // History list state
  const [interviews, setInterviews] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Right-panel view state
  // "empty" | "detail" | "new-setup" | "new-interview" | "new-feedback"
  const [view, setView] = useState("new-setup");

  // Selected interview detail
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(true);

  // Active interview session state
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [interviewMode, setInterviewMode] = useState("analytic"); // "voice" | "text"
  const [voiceContext, setVoiceContext] = useState(null); // For voice agent system prompt & context

  useEffect(() => {
    getAllLiveInterviews("job")
      .then(setInterviews)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    if (["detail", "new-interview", "new-feedback"].includes(view)) {
      setMobileHistoryOpen(false);
    }
  }, [view]);

  const handleSelectInterview = async (id) => {
    setSelectedId(id);
    setView("detail");
    setDetailLoading(true);
    try {
      const iv = await getLiveInterviewById(id);
      setSelectedInterview(iv);
    } catch {
      toast.error("Failed to load interview.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setSelectedInterview(null);
    setView("new-setup");
    // reset new interview state
    setInterviewId(null);
    setCurrentQuestion("");
    setQuestionIndex(1);
    setHistory([]);
    setFeedback(null);
    setScore(0);
    setSessionStartedAt(null);
    setVoiceContext(null);
  };

  const handleStarted = ({
    interviewId: id,
    firstQuestion,
    role,
    jobDescription,
    resumeText,
    difficulty,
    companyProfile,
    companyName,
    mode,
    startedAt,
  }) => {
    setInterviewId(id);
    setInterviewMode(mode || "analytic");
    setSessionStartedAt(startedAt || new Date().toISOString());

    if (mode === "interactive") {
      const resolvedCompanyName =
        companyName ||
        companyProfile?.name ||
        (companyProfile?.key ? companyProfile.key : "General");

      // Setup voice agent context
      const systemPrompt = `You are an expert interviewer conducting a job interview for the role of ${role}.

Job Description:
${jobDescription}

${resumeText ? `Candidate's Resume:\n${resumeText}\n\n` : ""}
${buildVoiceCompanyStylePrompt(companyProfile)}


Your job is to:
1. Ask insightful questions about the candidate's experience, skills, and fit for the role
2. Follow up on their answers naturally
3. Ask both technical and behavioral questions
4. Be conversational and engaging
5. After 5-7 questions, wrap up the interview
6. In your very first response, briefly mention that this is an interview for the ${role} position at ${resolvedCompanyName}, then ask the first question

Start by introducing yourself and asking the first question.`;

      setVoiceContext({
        systemPrompt,
        context: {
          interviewId: id,
          role,
          jobDescription,
          resumeText,
          companyProfile,
          companyName,
          mode: "job",
          interviewMode: "interactive",
        },
      });
    } else {
      // Text mode
      setCurrentQuestion(firstQuestion);
      setQuestionIndex(1);
      setHistory([]);
    }

    setView("new-interview");
    // add optimistic entry to list
    setInterviews((prev) => [
      {
        _id: id,
        mode: "job",
        role,
        companyName,
        difficulty,
        score: 0,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleAnswer = (nextQuestion, submittedAnswer) => {
    setHistory((prev) => [
      ...prev,
      { question: currentQuestion, answer: submittedAnswer },
    ]);
    setCurrentQuestion(nextQuestion);
    setQuestionIndex((i) => i + 1);
  };

  const handleEnd = (fb, sc) => {
    const finalScore = Number.isFinite(sc) ? sc : 0;
    setInterviews((prev) =>
      prev.map((iv) =>
        iv._id === interviewId
          ? { ...iv, score: finalScore, status: "completed" }
          : iv,
      ),
    );

    if (fb === null) {
      setView("empty");
      return;
    }

    setFeedback(fb);
    setScore(finalScore);
    setView("new-feedback");
  };

  const handleDeleteInterview = async (id) => {
    try {
      await deleteLiveInterview(id);
      setInterviews((prev) => prev.filter((iv) => iv._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedInterview(null);
        setView("empty");
      }
      toast.success("Interview deleted.");
    } catch {
      toast.error("Failed to delete interview.");
    }
  };

  const handleRetry = () => handleNew();

  const handleAnalyze = async () => {
    if (!interviewId) return;
    // Switch to detail view and load the completed interview
    setSelectedId(interviewId);
    setView("detail");
    setDetailLoading(true);
    try {
      const iv = await getLiveInterviewById(interviewId);
      setSelectedInterview(iv);
    } catch {
      toast.error("Failed to load interview.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden flex-col md:flex-row">
      {/* ── Mobile section sidebar (left drawer) ── */}
      <div
        className={[
          "md:hidden fixed inset-0 bg-black/30 z-30 transition-opacity",
          mobileHistoryOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileHistoryOpen(false)}
      />
      <aside
        className={[
          "md:hidden fixed top-11 bottom-0 left-0 z-40 w-[84%] max-w-xs",
          "bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222]",
          "transition-transform duration-200 flex flex-col",
          mobileHistoryOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <Mic size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Interviews
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileHistoryOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-100 dark:border-[#222]">
          <button
            type="button"
            onClick={() => {
              setMobileHistoryOpen(false);
              handleNew();
            }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors"
          >
            <Plus size={14} /> New Interview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {listLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-[#ea580c]" />
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No interviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {interviews.map((iv) => (
                <InterviewCard
                  key={iv._id}
                  interview={iv}
                  active={selectedId === iv._id}
                  onClick={() => {
                    setMobileHistoryOpen(false);
                    handleSelectInterview(iv._id);
                  }}
                  onDelete={handleDeleteInterview}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Left history panel ── */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-[#222] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <Mic size={14} className="text-[#ea580c]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Interviews
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            title="New Interview"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {listLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-[#ea580c]" />
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-10 px-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                No interviews yet.
              </p>
              <button
                type="button"
                onClick={handleNew}
                className="mt-3 text-xs font-medium text-[#ea580c] hover:underline"
              >
                Start your first one
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {interviews.map((iv) => (
                <InterviewCard
                  key={iv._id}
                  interview={iv}
                  active={selectedId === iv._id}
                  onClick={() => handleSelectInterview(iv._id)}
                  onDelete={handleDeleteInterview}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Right content panel ── */}
      <div
        className={`flex-1 p-4 md:p-6 lg:p-8 ${view === "new-interview" ? "flex flex-col min-h-0 overflow-hidden" : "overflow-y-auto"}`}
      >
        <div className="md:hidden flex items-center gap-2 mb-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileHistoryOpen((v) => !v)}
            className="h-9 px-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
          >
            {mobileHistoryOpen ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            Sidebar
          </button>
          <button
            type="button"
            onClick={handleNew}
            className="h-9 px-3 rounded-xl bg-[#ea580c] text-sm font-medium text-white hover:bg-[#d24e0b] transition-colors flex items-center gap-1.5"
          >
            <Plus size={13} /> New
          </button>
        </div>

        {view === "empty" && <EmptyPanel onNew={handleNew} />}

        {view === "detail" &&
          (detailLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            </div>
          ) : selectedInterview ? (
            <InterviewHistoryDetail interview={selectedInterview} />
          ) : null)}

        {view === "new-setup" && <SetupForm onStarted={handleStarted} />}

        {view === "new-interview" && (
          <div className="flex-1 min-h-0">
            {interviewMode === "interactive" && voiceContext ? (
              <VoiceInterviewAgent
                interviewId={interviewId}
                systemPrompt={voiceContext.systemPrompt}
                context={voiceContext.context}
                startedAt={sessionStartedAt}
                durationMs={30 * 60 * 1000}
                onTranscriptUpdate={(msg) => {
                  // Optional: track transcript for saving
                  console.log("[Transcript]", msg);
                }}
                onEnd={handleEnd}
              />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6 text-xs">
                  <span className="font-semibold uppercase tracking-widest text-[#ea580c]">
                    Interview
                  </span>
                  <ChevronRight size={12} className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Briefcase size={11} />
                    {interviews.find((iv) => iv._id === interviewId)?.role ||
                      "Mock Interview"}
                  </span>
                </div>
                <InterviewChat
                  interviewId={interviewId}
                  currentQuestion={currentQuestion}
                  questionIndex={questionIndex}
                  history={history}
                  startedAt={sessionStartedAt}
                  durationMs={30 * 60 * 1000}
                  onAnswer={handleAnswer}
                  onEnd={handleEnd}
                />
              </>
            )}
          </div>
        )}

        {view === "new-feedback" && (
          <InterviewFeedback
            interviewId={interviewId}
            feedback={feedback}
            score={score}
            onRetry={handleRetry}
            onAnalyze={handleAnalyze}
          />
        )}
      </div>
    </div>
  );
}
