import { useEffect, useState } from "react";
import { privateRequest } from "../api/config";

const FunctionAnswerTable = ({ evaluationId, functionName, target = null }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await privateRequest(`/nist-evaluation/answers/${evaluationId}`);
        const allQuestions = res.data.questions || [];
        const filteredQuestions = functionName
          ? allQuestions.filter(q => q.function === functionName)
          : allQuestions;

        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [evaluationId, functionName]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!questions.length) return <div className="text-white">No questions found.</div>;

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        {functionName ? `Summary of assessment - Function: ${functionName}` : "Summary of assessment"}
      </h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-700 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Subcategory Domain</th>
            <th className="p-2">Sub category code</th>
            <th className="p-2">Subcategory Description</th>
            <th className="p-2">Response</th>
            <th className="p-2">Score</th>
            {target !== null && (
              <>
                <th className="p-2">Target Value</th>
                <th className="p-2">Target Solution</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => {
            const targetSolution =
              target !== null && Array.isArray(q.answers)
                ? q.answers[target - 1] || q.answers[q.answers.length - 1]
                : null;

            return (
              <tr
                key={q.questionId}
                className={index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{q.function}</td>
                <td className="p-2">{q.subcategory}</td>
                <td className="p-2">{q.subcategoryDescription}</td>
                <td className="p-2">{q.answer || "No"}</td>
                <td className="p-2">{q.marks}</td>
                {target !== null && (
                  <>
                    <td className="p-2">{target}</td>
                    <td className="p-2">{targetSolution || "N/A"}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FunctionAnswerTable;
