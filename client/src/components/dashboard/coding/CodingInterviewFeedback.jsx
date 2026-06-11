import {
  ChevronLeft,
  Star,
  Code2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Zap,
  Layout,
  Timer,
} from "lucide-react";

const CodingInterviewFeedback = ({ feedback, score, onBack }) => {
  const safeScore = typeof score === "number" && Number.isFinite(score) ? score : 0;

  const scoreColor =
    safeScore >= 70
      ? "text-green-600 dark:text-green-400"
      : safeScore >= 45
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const scoreBg =
    safeScore >= 70
      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      : safeScore >= 45
        ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  const scoreLabel =
    safeScore >= 70 ? "Strong Performance" : safeScore >= 45 ? "Good" : "Needs Work";

  const categories = [
    {
      icon: Code2,
      label: "Technical",
      score: feedback?.technicalScore ?? 0,
    },
    {
      icon: Zap,
      label: "Problem Solving",
      score: feedback?.problemSolvingScore ?? 0,
    },
    {
      icon: Layout,
      label: "Code Quality",
      score: feedback?.codeQualityScore ?? 0,
    },
    {
      icon: Timer,
      label: "Complexity Analysis",
      score: feedback?.complexityAnalysisScore ?? 0,
    },
  ];

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
        {/* Overall score */}
        <div
          className={[
            "rounded-2xl border p-6 mb-6 text-center",
            scoreBg,
          ].join(" ")}
        >
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Overall Score
          </p>
          <p className={["text-5xl font-black", scoreColor].join(" ")}>
            {safeScore}
          </p>
          <p className={["text-sm font-bold mt-1", scoreColor].join(" ")}>
            {scoreLabel}
          </p>
        </div>

        {/* Category scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {categories.map((cat) => {
            const s = cat.score || 0;
            const color =
              s >= 7
                ? "text-green-600 dark:text-green-400"
                : s >= 4
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400";
            return (
              <div
                key={cat.label}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-3 text-center"
              >
                <cat.icon
                  size={16}
                  className="mx-auto mb-1.5 text-gray-400 dark:text-gray-500"
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {cat.label}
                </p>
                <p className={["text-lg font-bold", color].join(" ")}>
                  {s}/10
                </p>
              </div>
            );
          })}
        </div>

        {/* Strengths */}
        {feedback?.strengths?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <CheckCircle2 size={14} className="text-green-500" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {feedback?.weaknesses?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <AlertCircle size={14} className="text-red-500" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {feedback.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {feedback?.improvements?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <TrendingUp size={14} className="text-[#ea580c]" />
              Recommended Improvements
            </h3>
            <ul className="space-y-2">
              {feedback.improvements.map((imp, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#ea580c] mt-1.5 flex-shrink-0" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Problem breakdown */}
        {feedback?.problemBreakdown?.length > 0 && (
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-3">
              <Terminal size={14} className="text-[#ea580c]" />
              Problem Breakdown
            </h3>
            <div className="space-y-3">
              {feedback.problemBreakdown.map((pb, i) => (
                <div
                  key={i}
                  className="border border-gray-100 dark:border-[#2a2a2a] rounded-lg p-3"
                >
                  <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                    {pb.problem || `Problem ${i + 1}`}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      {pb.correctness || "N/A"}
                    </span>
                    <span>Time: {pb.timeComplexity || "N/A"}</span>
                    <span>Space: {pb.spaceComplexity || "N/A"}</span>
                  </div>
                  {pb.feedback && (
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5">
                      {pb.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 rounded-xl text-sm font-bold transition-colors mt-4"
        >
          Back to History
        </button>
      </div>
    </div>
  );
};

export default CodingInterviewFeedback;
