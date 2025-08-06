import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { privateRequest } from "../../../api/config";
import QuestionCard from "./QuestionCard";
import SidebarInfo from "./SidebarInfo";
import { showToast } from "../../../lib/toast";

const NIST_FUNCTIONS = [
  "IDENTIFY",
  "PROTECT",
  "DETECT",
  "RESPOND",
  "RECOVER",
  "GOVERN",
];

export default function Questionnaire() {
  const [searchParams] = useSearchParams();
  const[evaluationId, setEvaluationId] = useState(searchParams.get("evaluation-id"));

  const [currentFunctionIndex, setCurrentFunctionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submitLoading, setSubmitLoadidng] = useState(false);
  const [marksResponse, setMarksResponse] = useState(null);

  const currentFunction = NIST_FUNCTIONS[currentFunctionIndex];

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      setLoading(true);

      try {
        // Fetch questions first
        const resQuestions = await privateRequest.get(`/nist-questions/?function=${currentFunction}`);
        const rawQuestions = resQuestions.data.questions || [];

        const mergedQuestions = [];
        for (let i = 0; i < rawQuestions.length; i++) {
          const q = rawQuestions[i];

          if (q.questionText?.trim()) {
            mergedQuestions.push({
              ...q,
              subcategory: [q.subcategory],
            });
          } else if (mergedQuestions.length > 0) {
            const last = mergedQuestions[mergedQuestions.length - 1];
            last.subcategory.push(q.subcategory);
          }
        }

        setQuestions(mergedQuestions);

        if (evaluationId) {
          const resEval = await privateRequest.get(`/nist-evaluation/stats/${evaluationId}`);
          const givenAnswers = resEval.data.data.answersGiven || [];

          const currentFunctionAnswers = givenAnswers.filter(
            (ans) => ans.functionName === currentFunction
          );

          // console.log("current function answers are ", currentFunctionAnswers)

          const mappedAnswers = {};
          for (let entry of currentFunctionAnswers) {
            const question = mergedQuestions.find((q) => q._id === entry.questionId);
            if (!question || !question.answers || question.answers.length === 0) continue;

            const primaryIndex = entry.marks - 1; // marks were submitted as marks + 1

            const answer = question.answers[primaryIndex] || question.answers[0];
            // console.log("primary index is ", primaryIndex, " and followup is ", answer.slice(0,3) == "Yes")

            mappedAnswers[entry.questionId] = {
              primary: entry.marks > 1 ? "Yes" : "No",
              followUp: answer.slice(0,3) == "Yes" ? "None of the below" : answer || "",
              marks: primaryIndex,
              functionName: entry.functionName,
            };
          }

          // console.log("mapped answers are ", mappedAnswers)

          setAnswers(prev => {
            return typeof prev === "object" && prev !== null
              ? { ...prev, ...mappedAnswers }
              : { ...mappedAnswers };
          });


        }
      } catch (err) {
        console.error("Failed to fetch questions or evaluation data", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndAnswers();
  }, [currentFunction, evaluationId]);


const goToNextFunction = async () => {
  setSubmitLoadidng(true);
  await calculateAndSubmitScore(false);
  setSubmitLoadidng(false);

  if (currentFunctionIndex < NIST_FUNCTIONS.length - 1) {
    setCurrentFunctionIndex((prev) => prev + 1);
    setIsSubmitted(false);
  }
};

const goToPreviousFunction = async () => {
  setSubmitLoadidng(true);
  await calculateAndSubmitScore(false);
  setSubmitLoadidng(false);

  if (currentFunctionIndex > 0) {
    setCurrentFunctionIndex((prev) => prev - 1);
    setIsSubmitted(false);
  }
};

const handleSubmit = async () => {
  setSubmitLoadidng(true);
  await calculateAndSubmitScore(true);
  setSubmitLoadidng(false);
  setIsSubmitted(true);
};


  // useEffect(function () {
  //   console.log("answers changed ", answers)
  // })

  const calculateAndSubmitScore = async (submitting=false) => {
    console.log("evaluation id is ", evaluationId)
    const transformedAnswers = Object.entries(answers).map(([questionId, data]) => ({
      questionId,
      ...data,
      marks: data.marks + 1,
    }));

    let totalScore = 0;
    let totalQuestions = transformedAnswers.length;

    transformedAnswers.forEach((entry) => {
      totalScore += entry.marks || 0;
    });

    totalScore += transformedAnswers.length;

    const average = totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(2) : "0.00";

    try {
      const payload = {
        // marks: parseFloat(average),
        answers: transformedAnswers,
        status: submitting
      };

      let response;

      if (evaluationId) {
        response = await privateRequest.put(`/nist-evaluation/${evaluationId}`, payload)
      }
      else {
        response = await privateRequest.post("/nist-evaluation", payload);
      }

      if (response.status === 200) {
        showToast.success("Marks recorded successfully.");
        setEvaluationId(response.data.data.evaluationId);
        setMarksResponse(response.data.data.marks);
      }
    } catch (err) {
      console.error("Error submitting marks:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex">
      <SidebarInfo
        current={currentFunction}
        index={currentFunctionIndex}
        total={NIST_FUNCTIONS.length}
        onPrev={goToPreviousFunction}
        onNext={goToNextFunction}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
        submitLoading={submitLoading}
      />

      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-red-400 text-lg">
              No questions found for <span className="font-bold">{currentFunction}</span>
            </p>
          </div>
        ) : isSubmitted ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-green-800/10 p-6 rounded-lg max-w-md">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Submitted!</h2>
              <p className="text-gray-300 mb-4">
                Your responses have been recorded.
              </p>
              <p className="text-blue-400 text-lg mt-1">Average Score: {marksResponse}</p>
            </div>
          </div>
        ) : (
          <QuestionCard
            questions={questions}
            functionName={currentFunction}
            answersParent={answers}
            setAnswersParent={setAnswers}
            handleSubmission={calculateAndSubmitScore}
            submissionLoading={submitLoading}
          />
        )}
      </div>
    </div>
  );
}
