import { useEffect, useState } from "react";

export default function QuestionCard({ 
  questions, 
  domain, 
  answersParent, 
  onAnswerChange, 
  onAutoSave // NEW — called after any change
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = questions[currentIndex];
  const currentAnswer = answersParent[current?._id] || {};

  // Default answer to "No" and trigger submission
  useEffect(() => {
    if (current && !answersParent[current._id]) {
      const defaultAnswer = {
        primary: "No",
        followUp: "",
        marks: 0,
        domain
      };
      onAnswerChange(current._id, defaultAnswer);
      if (onAutoSave) onAutoSave(); // immediately save
    }
  }, [current?._id, domain]);

  const handlePrimary = (value) => {
    const updatedAnswer = {
      primary: value,
      followUp: value === "Yes" ? "None of the below" : "",
      marks: value === "Yes" ? 1 : 0,
      domain
    };
    onAnswerChange(current._id, updatedAnswer);
    if (onAutoSave) onAutoSave();
  };

  const handleFollowUp = (value) => {
    const followUpMark = value === "None of the below" ? 1 : current.answers.indexOf(value);
    const updatedAnswer = {
      ...answersParent[current._id],
      followUp: value,
      marks: followUpMark,
      domain
    };
    onAnswerChange(current._id, updatedAnswer);
    if (onAutoSave) onAutoSave();
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold mb-4">{current?.Practice}</h3>
      <p className="text-md mb-6 bg-blue-100 text-blue-900 px-4 py-3 rounded-md border-l-4 border-blue-400">
        {current?.PracticeText}
      </p>

      <div className="space-y-4 mb-8">
        {["No", "Yes"].map((opt) => (
          <button
            key={opt}
            onClick={() => handlePrimary(opt)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              currentAnswer?.primary === opt
                ? "border-blue-500 bg-blue-800/20"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {currentAnswer.primary === "Yes" && current.answers?.length > 2 && (
        <div className="mb-8">
          <h4 className="text-gray-300 mb-2">Please specify:</h4>
          {["None of the below", ...current.answers.slice(2)].map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleFollowUp(ans)}
              className={`w-full text-left px-4 py-2 rounded-md border text-sm mb-2 transition-all ${
                currentAnswer?.followUp === ans
                  ? "border-sky-500 bg-sky-800/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {ans}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-10">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="text-sm px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40"
        >
          Previous
        </button>
        <div className="text-sm text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <button
          onClick={() => setCurrentIndex((i) => i + 1)}
          disabled={currentIndex === questions.length - 1}
          className="text-sm px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
