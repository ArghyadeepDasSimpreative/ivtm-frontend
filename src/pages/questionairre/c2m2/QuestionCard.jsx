import { useEffect, useState } from "react";

export default function QuestionCard({
  questions,
  domain,
  answersParent,
  onAnswerChange,
  onAutoSave,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  Button,
  submitLoading,
  pageLoading,
  setPageLoading
}) {
  // const [pageLoading, setPageLoading] = useState(false);
  const current = questions[currentQuestionIndex];
  const currentAnswer = answersParent[current?._id] || {};

  console.log("pageloading is ", pageLoading)

  function ShimmerLoader() {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-4 animate-pulse bg-slate-800 p-4 rounded">
        <div className="h-8 bg-slate-700 rounded w-1/2 mt-10"></div>
        <div className="h-6 bg-slate-700 rounded w-full"></div>
        <div className="h-12 bg-slate-700 rounded w-full mt-4"></div>
        <div className="h-10 bg-slate-700 rounded w-full mt-2"></div>
        <div className="flex justify-between items-center mt-10">
          <div className="h-10 w-20 bg-slate-700 rounded"></div>
          <div className="h-6 bg-slate-700 rounded w-24"></div>
          <div className="h-10 w-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }


  // Default to prefill logic if not already done (especially loaded from old evaluation)
  useEffect(() => {
    if (
      current &&
      !answersParent[current._id] &&
      current.options &&
      current.options.length
    ) {
      const defaultAnswer = {
        primary: "No",
        followUp: "",
        marks: 0,
        domain
      };
      onAnswerChange(current._id, defaultAnswer);
      if (onAutoSave) onAutoSave();
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
    const followUpMark = value === "None of the below" ? 1 : current.options.indexOf(value);
    const updatedAnswer = {
      ...answersParent[current._id],
      followUp: value,
      marks: followUpMark,
      domain
    };
    onAnswerChange(current._id, updatedAnswer);
    if (onAutoSave) onAutoSave();
  };

  const goPrev = async () => {
    if (currentQuestionIndex === 0 || submitLoading) {
      console.log('goPrev returned early due to index or submitLoading');
      return;
    }
    console.log('goPrev: setting pageLoading true');
    setPageLoading(true);
    await onAutoSave();
    setCurrentQuestionIndex((i) => i - 1);
    console.log('goPrev: setting pageLoading false');
    setPageLoading(false);
  };

  const goNext = async () => {
    if (currentQuestionIndex === questions.length - 1 || submitLoading) {
      console.log('goNext returned early due to index or submitLoading');
      return;
    }
    console.log('goNext: setting pageLoading true');
    setPageLoading(true);
    await onAutoSave();
    setCurrentQuestionIndex((i) => i + 1);
    console.log('goNext: setting pageLoading false');
    setPageLoading(false);
  };


  if (pageLoading) {
    return <ShimmerLoader />;
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold mb-4">{current?.practice}</h3>
      <p className="text-md mb-6 bg-blue-100 text-blue-900 px-4 py-3 rounded-md border-l-4 border-blue-400">
        {current?.practiceText}
      </p>

      <div className="space-y-4 mb-8">
        {["No", "Yes"].map((opt) => (
          <button
            key={opt}
            onClick={() => handlePrimary(opt)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${currentAnswer?.primary === opt
              ? "border-blue-500 bg-blue-800/20"
              : "border-white/10 hover:border-white/20"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {currentAnswer.primary === "Yes" && current.options?.length > 2 && (
        <div className="mb-8">
          <h4 className="text-gray-300 mb-2">Please specify:</h4>
          {["None of the below", ...current.options.slice(2)].map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleFollowUp(ans)}
              className={`w-full text-left px-4 py-2 rounded-md border text-sm mb-2 transition-all ${currentAnswer?.followUp === ans
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
        <Button
          variant="secondary"
          onClick={goPrev}
          disabled={currentQuestionIndex === 0 || submitLoading}
          loading={false}
          size="sm"
        >
          Previous
        </Button>
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Button
          variant="primary"
          onClick={goNext}
          disabled={currentQuestionIndex === questions.length - 1 || submitLoading}
          loading={false}
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
