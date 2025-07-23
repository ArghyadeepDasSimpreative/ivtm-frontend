import { useEffect, useState } from "react";
import { privateRequest } from "../../../api/config";
import QuestionCard from "./QuestionCard";
import Button from "../../../components/Button";
import { showToast } from "../../../lib/toast";
import { Link } from "react-router-dom";

export default function HipaaQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitloading, setSubmitLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await privateRequest.get("/hipaa-questions");
        setQuestions(res.data.questions);
      } catch (error) {
        console.error("Failed to fetch HIPAA questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (questionId, answerObj) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerObj,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await privateRequest.post("/hipaa-evaluations", {
        answers: Object.values(answers),
      });
      if (response.status === 201) {
        showToast.success("HIPAA assessment record has been recorded successfully.");
        setIsSubmitted(true);
      } else {
        throw new Error("Something happened while submitting the answers.");
      }
    } catch (err) {
      showToast.error(err?.response?.data?.message || "Something happened while submitting the answers.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      {/* Left Sidebar */}
      <div className="lg:block lg:w-1/3 bg-[#0f172a] flex items-center justify-center p-6">
        <h2 className="text-3xl font-bold text-cyan-400">HIPAA Portal</h2>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/3 px-4 py-8 lg:px-12 bg-slate-950 shadow-lg relative">
        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl text-center max-w-md w-full border border-cyan-700">
                <h2 className="text-2xl font-bold mb-4 text-green-400">Submission Successful!</h2>
                <p className="mb-6 text-gray-300">
                  Your answers have been recorded. You can now view your analysis.
                </p>
                <Link to="/hipaa-analysis">
                  <Button>Go to Analysis</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-cyan-200 mb-8">
                HIPAA Assessment
              </h1>

              {loading ? (
                <p className="text-gray-400 text-lg">Loading questions...</p>
              ) : (
                <>
                  <div className="space-y-6">
                    {questions.map((q) => (
                      <QuestionCard
                        key={q._id}
                        questionData={q}
                        response={answers[q._id]?.questionAnswer || ""}
                        onSelect={handleAnswerSelect}
                      />
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button onClick={handleSubmit} loading={submitloading}>
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
