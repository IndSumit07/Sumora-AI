import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import InterviewSetup from "./InterviewSetup";
import InterviewChat from "./InterviewChat";
import InterviewFeedback from "./InterviewFeedback";

export default function InterviewPage({ session, onBack, onDone }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState("setup"); // "setup" | "interview" | "feedback"

  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionIndex, setQuestionIndex] = useState(1);

  // history = completed turns: [{ question, answer }, ...]
  const [history, setHistory] = useState([]);

  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** Called by InterviewSetup when the server returns the first question. */
  const handleInterviewStart = ({ interviewId: id, firstQuestion }) => {
    setInterviewId(id);
    setCurrentQuestion(firstQuestion);
    setQuestionIndex(1);
    setHistory([]);
    setPhase("interview");
  };

  const handleAnswer = (nextQuestion, submittedAnswer) => {
    setHistory((prev) => [
      ...prev,
      { question: currentQuestion, answer: submittedAnswer },
    ]);
    setCurrentQuestion(nextQuestion);
    setQuestionIndex((i) => i + 1);
  };

  const handleEnd = (feedbackData, overallScore) => {
    setFeedback(feedbackData);
    setScore(overallScore);
    setPhase("feedback");
  };

  /** Called by InterviewFeedback's "Start Another Interview" / "Back to History". */
  const handleRetry = () => {
    if (onDone) {
      onDone();
      return;
    }
    setPhase("setup");
    setInterviewId(null);
    setCurrentQuestion("");
    setQuestionIndex(1);
    setHistory([]);
    setFeedback(null);
    setScore(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return (
      <div className="space-y-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to History
          </button>
        )}
        <InterviewSetup session={session} onInterviewStart={handleInterviewStart} />
      </div>
    );
  }

  if (phase === "interview") {
    return (
      <InterviewChat
        interviewId={interviewId}
        currentQuestion={currentQuestion}
        questionIndex={questionIndex}
        history={history}
        onAnswer={handleAnswer}
        onEnd={handleEnd}
      />
    );
  }

  // phase === "feedback"
  return (
    <InterviewFeedback
      feedback={feedback}
      score={score}
      onRetry={handleRetry}
    />
  );
}
