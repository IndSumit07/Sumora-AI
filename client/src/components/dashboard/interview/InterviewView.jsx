import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  Building2,
  Globe,
  MapPin,
  Wrench,
  Star,
  CheckCircle2,
  ArrowRight,
  PauseCircle,
  LayoutGrid,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterview } from "../../../context/InterviewContext";
import {
  COMPANIES,
  JOB_ROLES,
  getRoleByKey,
  getCompanyByKey,
  buildVoiceCompanyStylePrompt,
} from "../../../shared/companyInterviewProfiles";
import useServiceExitGuard from "../../../hooks/useServiceExitGuard";
import ServiceExitConfirmModal from "../../ServiceExitConfirmModal";
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

// ── Company grid card ─────────────────────────────────────────────────────────

const CompanyCard = ({ company, onSelect }) => {
  const [logoError, setLogoError] = useState(false);
  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const regionColors = {
    India: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    Global: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      className="group rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5 text-left transition-all hover:border-[#ea580c]/50 hover:shadow-lg dark:hover:shadow-[#ea580c]/5 hover:-translate-y-0.5 duration-200"
    >
      {/* Header: logo + name + region */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative h-12 w-12 rounded-xl bg-gray-50 dark:bg-[#242424] flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#333]">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 select-none">
            {initials}
          </span>
          {company.logoUrl && !logoError && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="absolute inset-0 h-full w-full object-contain bg-white p-1.5"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#ea580c] transition-colors">
            {company.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
              regionColors[company.region] || regionColors.Global
            }`}
          >
            {company.region === "India" ? (
              <MapPin size={9} />
            ) : (
              <Globe size={9} />
            )}
            {company.region}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 mb-3">
        <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">
          {company.description}
        </p>
      </div>

      {/* Roles pills */}
      <div className="flex flex-wrap gap-1.5">
        {company.availableRoles.slice(0, 3).map((roleKey) => {
          const role = JOB_ROLES[roleKey];
          return role ? (
            <span
              key={roleKey}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ea580c]/8 dark:bg-[#ea580c]/12 text-[#ea580c] border border-[#ea580c]/20"
            >
              {role.name}
            </span>
          ) : null;
        })}
        {company.availableRoles.length > 3 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400">
            +{company.availableRoles.length - 3} more
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 group-hover:text-[#ea580c] transition-colors">
        Select & Choose Role
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
};

// ── Role selection card ───────────────────────────────────────────────────────

const RoleCard = ({ roleKey, active, onSelect }) => {
  const role = JOB_ROLES[roleKey];
  if (!role) return null;

  return (
    <button
      type="button"
      onClick={() => onSelect(roleKey)}
      className={[
        "rounded-2xl border p-4 text-left transition-all duration-200",
        active
          ? "border-[#ea580c] bg-[#ea580c]/8 dark:bg-[#ea580c]/12 shadow-sm"
          : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] hover:border-[#ea580c]/40 hover:bg-gray-50 dark:hover:bg-[#1e1e1e]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {active && (
            <CheckCircle2 size={14} className="text-[#ea580c] flex-shrink-0" />
          )}
          <h3
            className={`text-sm font-bold ${
              active
                ? "text-[#ea580c]"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {role.name}
          </h3>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
        {role.jobDescription}
      </p>

      {/* Tools */}
      <div className="flex flex-wrap gap-1">
        {role.tools.slice(0, 4).map((tool) => (
          <span
            key={tool}
            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 font-medium"
          >
            {tool}
          </span>
        ))}
        {role.tools.length > 4 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2a2a2a] text-gray-400 dark:text-gray-500">
            +{role.tools.length - 4}
          </span>
        )}
      </div>
    </button>
  );
};

// ── Step 1: Companies Grid ────────────────────────────────────────────────────

const CompaniesStep = ({ onSelectCompany }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = COMPANIES.filter((c) => {
    const matchRegion = filter === "all" || c.region.toLowerCase() === filter;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-xl bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-[#ea580c]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Choose a Company
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Select a company to get a tailored mock interview experience
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "india", "global"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                filter === f
                  ? "bg-[#ea580c] text-white"
                  : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]",
              ].join(" ")}
            >
              {f === "all" ? (
                <span className="flex items-center gap-1.5"><LayoutGrid size={11} />All ({COMPANIES.length})</span>
              ) : f === "india" ? (
                <span className="flex items-center gap-1.5"><MapPin size={11} />India</span>
              ) : (
                <span className="flex items-center gap-1.5"><Globe size={11} />Global</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="h-8 w-full rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] px-3 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Building2 size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-500">No companies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard
              key={company.key}
              company={company}
              onSelect={onSelectCompany}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Step 2: Role Selection ────────────────────────────────────────────────────

const RolesStep = ({ company, onBack, onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] flex items-center justify-center transition-colors flex-shrink-0"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative h-10 w-10 rounded-xl bg-gray-50 dark:bg-[#242424] flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#333]">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            {initials}
          </span>
          {company.logoUrl && !logoError && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="absolute inset-0 h-full w-full object-contain bg-white p-1"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Select a role to interview for
          </p>
        </div>
      </div>

      {/* Company description callout */}
      <div className="rounded-xl border border-[#ea580c]/20 bg-[#ea580c]/5 dark:bg-[#ea580c]/8 p-4 mb-6">
        <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          {company.description}
        </p>
      </div>

      {/* Role grid */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        {company.availableRoles.length} Available Role
        {company.availableRoles.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {company.availableRoles.map((rk) => (
          <RoleCard
            key={rk}
            roleKey={rk}
            active={selectedRole === rk}
            onSelect={(k) => setSelectedRole(k === selectedRole ? null : k)}
          />
        ))}
      </div>

      {/* Continue button */}
      <button
        type="button"
        disabled={!selectedRole}
        onClick={() => selectedRole && onSelectRole(selectedRole)}
        className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {selectedRole ? (
          <>
            Continue as {JOB_ROLES[selectedRole]?.name}
            <ArrowRight size={15} />
          </>
        ) : (
          "Select a Role to Continue"
        )}
      </button>
    </div>
  );
};

// ── Step 3: Setup form (resume + difficulty + speak mode) ─────────────────────

const SetupStep = ({ company, roleKey, onBack, onStarted }) => {
  const { uploadResume, startInterview } = useInterview();
  const role = getRoleByKey(roleKey);
  const [logoError, setLogoError] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const fileRef = useRef(null);

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      toast.success("Resume parsed successfully.");
    } catch {
      toast.error("Failed to parse resume.");
      setResumeFile(null);
      setResumeText("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleStart = async () => {
    if (!resumeText.trim()) {
      toast.error("Resume upload is required.");
      return;
    }

    const companyProfile = {
      type: "preset",
      key: company.key,
      name: company.name,
    };

    const finalRole = role?.name || "Software Engineer";
    const finalJobDesc = role?.jobDescription || company.description;

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
        companyName: company.name,
        startedAt,
        mode: "interactive",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setStartLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] flex items-center justify-center transition-colors flex-shrink-0"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative h-10 w-10 rounded-xl bg-gray-50 dark:bg-[#242424] flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#333]">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            {initials}
          </span>
          {company.logoUrl && !logoError && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="absolute inset-0 h-full w-full object-contain bg-white p-1"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {company.name} — {role.name}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Upload your resume and start your interview
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Role & JD preview */}
        <div className="rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] p-5">
          {/* Role details */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Role Details
          </p>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {role.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            {role.jobDescription}
          </p>

          {/* Skills */}
          {role.skills && role.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                <Star size={10} /> Key Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {role.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {role.tools && role.tools.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                <Wrench size={10} /> Tools & Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {role.tools.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resume upload */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
            Resume <span className="normal-case font-normal text-red-400">(required)</span>
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
          {resumeText && (
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <CheckCircle2 size={10} />
              Resume parsed — AI will tailor questions to your experience
            </p>
          )}
        </div>

        {/* Speak Mode */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
            Speak Mode
          </label>
          <div className="flex gap-2">
            {[
              { value: "normal", icon: Mic, label: "Speak Normally" },
              { value: "hold", icon: PauseCircle, label: "Hold to Speak" },
            ].map(({ value, icon: ModeIcon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  window.speakMode = value;
                  document.dispatchEvent(new Event("speakModeChanged"));
                }}
                className={[
                  "flex-1 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5",
                  speakMode === value
                    ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#333]",
                ].join(" ")}
              >
                <ModeIcon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
            Difficulty
          </label>
          <div className="flex gap-2">
            {[
              {
                value: "easy",
                label: "Easy",
                active: "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
              },
              {
                value: "medium",
                label: "Medium",
                active: "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
              },
              {
                value: "hard",
                label: "Hard",
                active: "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
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

        {/* Start button */}
        <button
          type="button"
          onClick={handleStart}
          disabled={startLoading || uploadLoading || !resumeText.trim()}
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-semibold text-white hover:bg-[#d24e0b] transition-all focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  const {
    getAllLiveInterviews,
    getLiveInterviewById,
    deleteLiveInterview,
    endInterview,
  } = useInterview();

  // History list state
  const [interviews, setInterviews] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Right-panel view state
  // "empty" | "detail" | "companies" | "roles" | "setup" | "new-interview" | "new-feedback"
  const [view, setView] = useState("companies");

  // Selection state for the 3-step flow
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRoleKey, setSelectedRoleKey] = useState(null);

  // Selected interview detail
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(true);

  // Active interview session state
  const [interviewId, setInterviewId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [voiceContext, setVoiceContext] = useState(null);

  const interviewActive = view === "new-interview" && Boolean(interviewId);

  const closeActiveInterview = async () => {
    if (!interviewActive || !interviewId) return;
    try {
      await endInterview(interviewId, { skipFeedback: true });
    } catch {
      // Continue navigation even if server cleanup fails.
    }
  };

  const { isOpen, isConfirming, requestExit, confirmExit, cancelExit } =
    useServiceExitGuard({
      when: interviewActive,
      onConfirmExit: closeActiveInterview,
    });

  useEffect(() => {
    getAllLiveInterviews("job")
      .then(setInterviews)
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, [getAllLiveInterviews]);

  useEffect(() => {
    if (["detail", "new-interview", "new-feedback"].includes(view)) {
      setMobileHistoryOpen(false);
    }
  }, [view]);

  const openInterviewDetail = async (id) => {
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

  const handleSelectInterview = (id) => {
    requestExit(() => {
      void openInterviewDetail(id);
    });
  };

  const resetNewInterview = () => {
    setSelectedId(null);
    setSelectedInterview(null);
    setSelectedCompany(null);
    setSelectedRoleKey(null);
    setInterviewId(null);
    setFeedback(null);
    setScore(0);
    setSessionStartedAt(null);
    setVoiceContext(null);
    setView("companies");
  };

  const handleNew = () => {
    requestExit(resetNewInterview);
  };

  // ── Browser back-button interception for the 3-step flow ──────────────────
  // When the user navigates forward into "roles" or "setup", push a dummy
  // history entry so the browser back button fires popstate — which we catch
  // and handle as an internal step-back instead of a route change.
  const handlePopState = useCallback(() => {
    setView((current) => {
      if (current === "setup") return "roles";
      if (current === "roles") return "companies";
      return current; // let React Router handle it for other views
    });
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [handlePopState]);

  // Step 1 → 2: company selected
  const handleCompanySelected = (company) => {
    setSelectedCompany(company);
    // Push a dummy state so the browser back button fires popstate
    window.history.pushState({ interviewFlow: "roles" }, "");
    setView("roles");
  };

  // Step 2 → 3: role selected
  const handleRoleSelected = (roleKey) => {
    setSelectedRoleKey(roleKey);
    // Push a dummy state so the browser back button fires popstate
    window.history.pushState({ interviewFlow: "setup" }, "");
    setView("setup");
  };

  // Step 3: interview started
  const handleStarted = ({
    interviewId: id,
    role,
    jobDescription,
    resumeText,
    difficulty,
    companyProfile,
    companyName,
    startedAt,
  }) => {
    setInterviewId(id);
    setSessionStartedAt(startedAt || new Date().toISOString());

    const resolvedCompanyName =
      companyName ||
      companyProfile?.name ||
      (companyProfile?.key ? companyProfile.key : "General");

    const systemPrompt = `You are an expert interviewer conducting a job interview for the role of ${role} at ${resolvedCompanyName}.

Job Description:
${jobDescription}

${resumeText ? `Candidate's Resume:\n${resumeText}\n\n` : ""}
${buildVoiceCompanyStylePrompt(companyProfile)}


Your job is to:
1. Ask insightful questions about the candidate's experience, skills, and fit for the role
2. Follow up on their answers naturally based on what they say — ask deeper follow-up questions when needed
3. Ask both technical and behavioral questions tailored to the role
4. Be conversational, encouraging, and professional
5. After 5-7 questions, wrap up the interview politely
6. In your very first response, briefly mention that this is an interview for the ${role} position at ${resolvedCompanyName}, then ask the first question

Start by introducing yourself as an interviewer at ${resolvedCompanyName} and asking your first question about the candidate's background.`;

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

    setView("new-interview");
    // optimistic list entry
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
    <>
      <div className="flex h-full overflow-hidden flex-col md:flex-row">
        {/* ── Mobile sidebar backdrop ── */}
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

        {/* ── Left history panel (desktop) ── */}
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
          className={`flex-1 p-4 md:p-6 lg:p-8 ${
            view === "new-interview"
              ? "flex flex-col min-h-0 overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {/* Mobile top bar */}
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

          {/* Step indicator for setup flow */}
          {["companies", "roles", "setup"].includes(view) && (
            <div className="flex items-center gap-2 mb-6 text-xs">
              <button
                onClick={() => setView("companies")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  view === "companies"
                    ? "text-[#ea580c] bg-[#ea580c]/10"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Building2 size={11} />
                Company
              </button>
              <ChevronRight size={11} className="text-gray-300 dark:text-gray-600" />
              <button
                onClick={() => selectedCompany && setView("roles")}
                disabled={!selectedCompany}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed ${
                  view === "roles"
                    ? "text-[#ea580c] bg-[#ea580c]/10"
                    : selectedCompany
                    ? "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                <Briefcase size={11} />
                Role
              </button>
              <ChevronRight size={11} className="text-gray-300 dark:text-gray-600" />
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold ${
                  view === "setup"
                    ? "text-[#ea580c] bg-[#ea580c]/10"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                <Mic size={11} />
                Setup
              </span>
            </div>
          )}

          {/* Views */}
          {view === "empty" && <EmptyPanel onNew={handleNew} />}

          {view === "detail" &&
            (detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#ea580c]" />
              </div>
            ) : selectedInterview ? (
              <InterviewHistoryDetail interview={selectedInterview} />
            ) : null)}

          {view === "companies" && (
            <CompaniesStep onSelectCompany={handleCompanySelected} />
          )}

          {view === "roles" && selectedCompany && (
            <RolesStep
              company={selectedCompany}
              onBack={() => setView("companies")}
              onSelectRole={handleRoleSelected}
            />
          )}

          {view === "setup" && selectedCompany && selectedRoleKey && (
            <SetupStep
              company={selectedCompany}
              roleKey={selectedRoleKey}
              onBack={() => setView("roles")}
              onStarted={handleStarted}
            />
          )}

          {view === "new-interview" && (
            <div className="flex flex-col h-full min-h-0 overflow-hidden">
              {/* Breadcrumb */}
              <div className="flex-shrink-0 flex items-center gap-1.5 mb-4 text-xs flex-wrap min-w-0">
                <span className="font-semibold uppercase tracking-widest text-[#ea580c] flex-shrink-0">
                  Interview
                </span>
                <ChevronRight size={11} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate max-w-[130px]">
                  <Briefcase size={11} className="flex-shrink-0" />
                  {interviews.find((iv) => iv._id === interviewId)?.role ||
                    "Mock Interview"}
                </span>
                {interviews.find((iv) => iv._id === interviewId)?.companyName && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">·</span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate max-w-[120px]">
                      <Building2 size={11} className="flex-shrink-0" />
                      {interviews.find((iv) => iv._id === interviewId)?.companyName}
                    </span>
                  </>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                {voiceContext ? (
                  <VoiceInterviewAgent
                    interviewId={interviewId}
                    systemPrompt={voiceContext.systemPrompt}
                    context={voiceContext.context}
                    startedAt={sessionStartedAt}
                    durationMs={30 * 60 * 1000}
                    onTranscriptUpdate={(msg) => {
                      console.log("[Transcript]", msg);
                    }}
                    onEnd={handleEnd}
                  />
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-[#ea580c]" />
                  </div>
                )}
              </div>
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

      <ServiceExitConfirmModal
        open={isOpen}
        title="End interview?"
        description="Your interview is still active. Leaving now will stop this interview session."
        confirmLabel="End Interview"
        cancelLabel="Continue Interview"
        confirming={isConfirming}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
    </>
  );
}
