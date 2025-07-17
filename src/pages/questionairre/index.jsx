import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateRequest } from "../../api/config";
import QuestionCard from "./QuestionCard";
import SidebarInfo from "./SidebarInfo";
import { showToast } from "../../lib/toast";

const NIST_FUNCTIONS = [
  "IDENTIFY",
  "PROTECT",
  "DETECT",
  "RESPOND",
  "RECOVER",
  "GOVERN",
];

export default function Questionnaire() {
  const { type } = useParams();
  const [currentFunctionIndex, setCurrentFunctionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitLoading, setSubmitLoadidng] = useState(false);
  const [marksResponse, setMarksResponse] = useState(null)

  const currentFunction = NIST_FUNCTIONS[currentFunctionIndex];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await privateRequest.get(`/nist-questions/?function=${currentFunction}`);
        const rawQuestions = res.data.questions || [];

        const mergedQuestions = [];

        for (let i = 0; i < rawQuestions.length; i++) {
          const q = rawQuestions[i];

          if (q.questionText?.trim()) {
            // Initialize subcategory as an array for future merging
            mergedQuestions.push({
              ...q,
              subcategory: [q.subcategory],
            });
          } else if (mergedQuestions.length > 0) {
            // Merge subcategory into previous question
            const last = mergedQuestions[mergedQuestions.length - 1];
            last.subcategory.push(q.subcategory);
          }
        }

        setQuestions(mergedQuestions);
      } catch (err) {
        console.error(err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };


    fetchQuestions();
  }, [currentFunction]);

  const goToNextFunction = () => {
    if (currentFunctionIndex < NIST_FUNCTIONS.length - 1) {
      setCurrentFunctionIndex((prev) => prev + 1);
      setIsSubmitted(false);
      // setAnswers({});
    }
  };

  const goToPreviousFunction = () => {
    if (currentFunctionIndex > 0) {
      setCurrentFunctionIndex((prev) => prev - 1);
      setIsSubmitted(false);
      // setAnswers({});
    }
  };

  const handleSubmit = () => {
    calculateAndSubmitScore();
    setIsSubmitted(true);
  };


  const calculateAndSubmitScore = async () => {
    console.log("answers objct is ",)
    const transformedAnswers = Object.entries(answers).map(([questionId, data]) => {
      console.log("marks is ", data);
      return ({
        questionId,
        ...data,
        marks: data.marks + 1,
      })
    }
    );

    console.log("final answers are ", transformedAnswers);
    let totalScore = 0;
    let totalQuestions = transformedAnswers.length; // Use the length of the transformed array

    transformedAnswers.forEach((entry) => { // Iterate through the transformed array
      totalScore += entry.marks || 0;
    });

    totalScore += transformedAnswers.length; // Add the number of questions to totalScore

    const average = totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(2) : "0.00";

    try {
      // setSubmitLoadidng(true); // Assuming this is defined in your component context
      let payload = {
        marks: parseFloat(average),
        answers: transformedAnswers
      };
      let response = await privateRequest.post("/nist-evaluation/marks", payload); // Assuming privateRequest is defined
      if (response.status == 200) {
        showToast.success("Marks recorded successfully."); // Assuming showToast is defined
        setMarksResponse(response.data.data.marks); // Assuming setMarksResponse is defined
      }
      console.log("Payload to be sent:", payload);
      // Simulate API call success
      console.log("Marks recorded successfully. Average Mark:", average);
    }
    catch (err) {
      console.error("Error submitting marks:", err);
    }
    finally {
      // setSubmitLoadidng(false);
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
              {/* <p className="text-white text-lg font-semibold">Total Score: {totalScore}</p> */}
              <p className="text-blue-400 text-lg mt-1">Average Score: {marksResponse}</p>
            </div>
          </div>
        ) : (
          <QuestionCard
            questions={questions}
            functionName={currentFunction}
            answersParent={answers}
            setAnswersParent={setAnswers}
          />
        )}
      </div>
    </div>
  );
}
