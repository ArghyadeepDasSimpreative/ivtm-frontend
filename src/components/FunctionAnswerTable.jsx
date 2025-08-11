import { useEffect, useState } from "react";
import { privateRequest } from "../api/config";
import * as XLSX from "xlsx"; // install via: npm install xlsx
import Button from "./Button";
import { FaRegFileExcel } from "react-icons/fa";

const FunctionAnswerTable = ({ evaluationId, functionName, target = null }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await privateRequest(`/nist-evaluation/answers/${evaluationId}`);
        const allQuestions = res.data.data || [];
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

  const exportToExcel = () => {
    if (!questions.length) return;

    // Format data for Excel
    const dataForExcel = questions.map((q, index) => {
      const targetSolution =
        target !== null && Array.isArray(q.answers)
          ? q.answers[target - 1] || q.answers[q.answers.length - 1]
          : null;

      return {
        "#": index + 1,
        "Subcategory Domain": q.function,
        "Subcategory Code": q.subcategory,
        "Subcategory Description": q.subcategoryDescription,
        "Response": q.answer || "No",
        "Score": q.marks,
        ...(target !== null && {
          "Target Value": target,
          "Target Solution": targetSolution || "N/A"
        })
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Summary");

    // Download the Excel file
    XLSX.writeFile(workbook, `assessment_summary_${evaluationId}.xlsx`);
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (!questions.length) return <div className="text-white">No questions found.</div>;

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">
          {functionName
            ? `Summary of assessment - Function: ${functionName}`
            : "Summary of assessment"}
        </h2>
        <Button onClick={exportToExcel}>
          <FaRegFileExcel size={20}/>
          Download Excel
        </Button>
      </div>

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
              target !== null && Array.isArray(q.options)
                ? q.options[target - 1] || q.options[q.options.length - 1]
                : null;

                console.log("taregt assessingggggg", q)

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
