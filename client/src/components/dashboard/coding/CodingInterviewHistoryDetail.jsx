import { ChevronLeft, Calendar, Clock, Code2, Terminal, MessageSquare } from "lucide-react";

const diffColors = {
  easy: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  medium: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  hard: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

const CodingInterviewHistoryDetail = ({ interview, onBack }) => {
  if (!interview) return null;

  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const score = interview.score ?? 0;
  const scoreColor =
    score >= 70
      ? "text-green-600 dark:text-green-400"
      : score >= 45
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 w-fit"
      >
        <ChevronLeft size={14} />
        Back to history
      </button>

      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={[
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider",
                diffColors[interview.difficulty] || diffColors.medium,
              ].join(" ")}
            >
              {interview.difficulty}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
              {interview.language}
            </span>
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Coding Interview
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Code2 size={12} />
              {interview.status === "completed" ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        {/* Score */}
        {interview.status === "completed" && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Overall Score</p>
            <p className={["text-4xl font-black", scoreColor].join(" ")}>
              {score}
            </p>
          </div>
        )}

        {/* Problem Statement */}
        {interview.problemStatement && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Terminal size={14} className="text-[#ea580c]" />
              Problem Statement
            </h3>
            <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {interview.problemStatement}
            </div>
          </div>
        )}

        {/* Starter Code */}
        {interview.starterCode && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Code2 size={14} className="text-[#ea580c]" />
              Starter Code
            </h3>
            <pre className="text-[11px] text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-lg overflow-x-auto font-mono">
              {interview.starterCode}
            </pre>
          </div>
        )}

        {/* Code Submissions */}
        {interview.codeSubmissions?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <Code2 size={14} className="text-[#ea580c]" />
              Code Submissions ({interview.codeSubmissions.length})
            </h3>
            <div className="space-y-3">
              {interview.codeSubmissions.map((sub, i) => (
                <div key={i} className="border border-gray-100 dark:border-[#2a2a2a] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Submission {i + 1}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {sub.language}
                    </span>
                  </div>
                  <pre className="text-[11px] text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1a1a] p-2 rounded-lg overflow-x-auto font-mono max-h-[200px] overflow-y-auto">
                    {sub.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        {interview.conversation?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <MessageSquare size={14} className="text-[#ea580c]" />
              Conversation
            </h3>
            <div className="space-y-3">
              {interview.conversation.map((turn, i) => (
                <div
                  key={i}
                  className={[
                    "text-xs rounded-xl px-3 py-2",
                    turn.role === "agent"
                      ? "bg-gray-50 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#2a2a2a]"
                      : "bg-[#ea580c]/10 text-[#ea580c]",
                  ].join(" ")}
                >
                  <span className="text-[10px] font-bold opacity-70 block mb-1">
                    {turn.role === "agent" ? "Interviewer" : "You"}
                  </span>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {turn.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {interview.feedback && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
              <Clock size={14} className="text-[#ea580c]" />
              Feedback
            </h3>
            <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {typeof interview.feedback === "string"
                ? interview.feedback
                : JSON.stringify(interview.feedback, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingInterviewHistoryDetail;
