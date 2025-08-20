import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import QuestionPagination from "../../../components/QuestionPagination";

export default function QuestionCard({
  questions,
  functionName,
  setAnswersParent,
  answersParent,
  handleSubmission,
  currentFunctionIndex,
  calculateAndSubmitScore,
  setIsSubmitted,

}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = questions[currentIndex];
  const currentAnswer = answersParent[current._id] || {};
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    if (!answersParent[current._id]) {
      handlePrimary("No");
    }
  }, [current._id]);

  const handlePrimary = (value) => {
    const baseUpdate = {
      primary: value,
      followUp: "",
      marks: 0,
      functionName
    };

    if (value === "Yes") {
      const update = {
        ...baseUpdate,
        followUp: "None of the below",
        marks: 1,
        functionName
      };

      setAnswersParent((prev) => ({
        ...prev,
        [current._id]: update,
      }));
    } else {
      setAnswersParent((prev) => ({
        ...prev,
        [current._id]: baseUpdate,
      }));
    }
  };

  const handleFollowUp = (value) => {
    const followUpMark = value === "None of the below" ? 1 : current.answers.indexOf(value);
    setAnswersParent((prev) => ({
      ...prev,
      [current._id]: {
        ...prev[current._id],
        followUp: value,
        marks: followUpMark,
      },
    }));
  };

  const goNext = async () => {
    setSubmissionLoading(true);
    await handleSubmission();
    setSubmissionLoading(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = async () => {
    setSubmissionLoading(true);
    await handleSubmission();
    setSubmissionLoading(false);
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const goToQuestion = async (index) => {
    if (index < 0 || index >= questions.length) return;
    if (index === currentIndex) return; // no-op if same page
    setSubmissionLoading(true);
    await handleSubmission();
    setCurrentIndex(index);
    setSubmissionLoading(false);
  };


  const handleSubmit = async () => {
    setSubmissionLoading(true);
    const response = await calculateAndSubmitScore(true);
    setSubmissionLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full gap-5">
      <motion.div
        key={current._id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-3xl mx-auto w-full"
      >
        <h3 className="text-lg font-semibold mb-4">{current.category}</h3>
        <p className="text-md mb-6 bg-blue-100 text-blue-900 dark:bg-blue-300/10 dark:text-blue-300 px-4 py-3 rounded-md border-l-4 border-blue-400 font-medium shadow-sm">
          {current.questionText}
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

        {currentAnswer.primary === "Yes" && current.answers?.length > 2 && (
          <div className="mb-8">
            <h4 className="text-gray-300 mb-2">Please specify:</h4>
            {["None of the below", ...current.answers.slice(2)].map((ans, idx) => (
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
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="text-sm px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40 cursor-pointer"
          >
            {submissionLoading ? "...Please wait" : "Previous"}
          </button>
          <div className="text-sm text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </div>

          {currentIndex + 1 !== questions.length ? (
            <button
              onClick={goNext}
              className="text-sm px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 cursor-pointer"
            >
              {submissionLoading ? "...Please wait" : "Next"}
            </button>
          ) : (
            currentFunctionIndex === 5 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 w-30 px-4 py-2 mb-6 hover:bg-green-800 transition-all cursor-pointer rounded-md"
              >
                {
                  submissionLoading ? <ClipLoader size={18} color="white" /> : " Submit"
                }

              </button>
            ) : (
              <div />
            )
          )}

        </div>

        {/* {currentAnswer?.primary && (
          <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
            <FaCheckCircle />
            Answer saved
          </div>
        )} */}

      </motion.div>

      <div className="rounded-lg border border-blue-500 bg-slate-900 px-6 py-4 shadow-md w-[80%] mx-auto">
        {/* <h2 className="text-blue-400 font-semibold text-md mb-1">
          Default Option Notice
        </h2> */}
        <p className="text-slate-100 text-sm">
          If nothing is selected, all questions of this section will have a default option selected.
        </p>
      </div>
      <QuestionPagination
        questions={questions}
        currentIndex={currentIndex}
        onSelect={goToQuestion}
        loading={submissionLoading}
      />
    </div>
  );
}
