import * as XLSX from "xlsx";
import Button from "./Button";
import { FaRegFileExcel } from "react-icons/fa";

const C2m2AnswerTable = ({ answers = [], target = null }) => {
  console.log("answers are ", answers[0])
  if (!answers.length) return <div className="text-white">No answers found.</div>;

  const exportToExcel = () => {
    const dataForExcel = answers.map((q, index) => {
      const targetSolution =
        target !== null && Array.isArray(q.options)
          ? q.options[target - 1] || q.options[q.options.length - 1]
          : null;

      return {
        "#": index + 1,
        "Domain": q.domain,
        "Practice Code": q.practice,
        "Practice Description": q.practiceText,
        "Response": q.answer || "No",
        "Score": q.marks || 0,
        ...(target !== null && {
          "Target Value": target,
          "Target Solution": q.marksArray[1] ? q.marksArray[1] < targetSolution ? "N/A" : targetSolution : "N/A",
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "C2M2 Summary");

    XLSX.writeFile(workbook, `c2m2_summary.xlsx`);
  };

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">
          C2M2 Assessment Summary
        </h2>
        <Button onClick={exportToExcel}>
          <FaRegFileExcel size={20} />
          Download Excel
        </Button>
      </div>

      <table className="w-full table-auto border-collapse !text-md">
        <thead>
          <tr className="bg-slate-700 text-left !text-md">
            <th className="p-2" style={{ fontSize: "14px" }}>#</th>
            <th className="p-2" style={{ fontSize: "14px" }}>Domain</th>
            <th className="p-2" style={{ fontSize: "14px" }}>Practice Code</th>
            <th className="p-2" style={{ fontSize: "14px" }}>Practice Description</th>
            <th className="p-2" style={{ fontSize: "14px" }}>Response</th>
            <th className="p-2" style={{ fontSize: "14px" }}>Score</th>
            {target !== null && (
              <>
                <th className="p-2" style={{ fontSize: "14px" }}>Target Value</th>
                <th className="p-2" style={{ fontSize: "14px" }}>Target Solution</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {answers.map((q, index) => {
            const targetSolution =
              target !== null && Array.isArray(q.options)
                ? q.options[target - 1] || q.options[q.options.length - 1]
                : null;

            const actualSolution =
              !q.marksArray[1] || q.marksArray[1] < target ? "N/A" : targetSolution;


            return (
              <tr
                key={q.questionId}
                className={index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}
              >
                <td className="p-2" style={{ fontSize: "14px" }}>{index + 1}</td>
                <td className="p-2" style={{ fontSize: "14px" }}>{q.domain}</td>
                <td className="p-2" style={{ fontSize: "14px" }}>{q.practice}</td>
                <td className="p-2" style={{ fontSize: "14px" }}>{q.practiceText}</td>
                <td className="p-2" style={{ fontSize: "14px" }}>{q.answer || "No"}</td>
                <td className="p-2" style={{ fontSize: "14px" }}>{q.marks || 0}</td>
                {target !== null && (
                  <>
                    <td className="p-2" style={{ fontSize: "14px" }}>{target}</td>
                    <td className="p-2" style={{ fontSize: "14px" }}>{actualSolution || "N/A"}</td>
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

export default C2m2AnswerTable;
