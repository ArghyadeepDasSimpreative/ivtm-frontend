import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Button from "./Button";
import { FaRegFileExcel } from "react-icons/fa";

const HipaaAnswerTable = ({ data, target = null, category }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    if (!category || category === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (q) => q.category && q.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [data, category]);

  if (!Array.isArray(filteredData)) {
    return <div className="text-white">Invalid data format</div>;
  }

  if (!filteredData.length) {
    return <div className="text-white">No questions found.</div>;
  }

  // 🔽 Excel download function
  const handleDownloadExcel = () => {
    const tableData = filteredData.map((q, index) => {
      const targetAnswer =
        target !== null && Array.isArray(q.options)
          ? q.options[target - 1] || q.options[q.options.length - 1]
          : null;

      return {
        "#": index + 1,
        Category: q.category || "N/A",
        Description: q.description || "N/A",
        Response:
          q.selectedAnswer === "None of the below"
            ? "Yes"
            : q.selectedAnswer || "No",
        Score: q.marks || 0,
        ...(target !== null && {
          "Target Value": target,
          "Target Solution":
            targetAnswer === "None of the below" ? "Yes" : targetAnswer || "N/A",
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Summary");
    XLSX.writeFile(workbook, "hipaa_assessment_summary.xlsx");
  };

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">
          {target !== null
            ? `Summary of assessment - Target Comparison (Target: ${target})`
            : "Summary of assessment"}
        </h2>
        <Button
          onClick={handleDownloadExcel}
        >
          <FaRegFileExcel size={20}/>
          Download Excel
        </Button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-700 text-left">
            <th className="p-2" style={{ fontSize: "14px" }}>
              #
            </th>
            <th className="p-2" style={{ fontSize: "14px" }}>
              Category
            </th>
            <th className="p-2" style={{ fontSize: "14px" }}>
              Description
            </th>
            <th className="p-2" style={{ fontSize: "14px" }}>
              Response
            </th>
            <th className="p-2" style={{ fontSize: "14px" }}>
              Score
            </th>
            {target !== null && (
              <>
                <th className="p-2" style={{ fontSize: "14px" }}>
                  Target Value
                </th>
                <th className="p-2" style={{ fontSize: "14px" }}>
                  Target Solution
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((q, index) => {
            const targetAnswer =
              target !== null && Array.isArray(q.options)
                ? q.options[target - 1] || q.options[q.options.length - 1]
                : null;

            return (
              <tr
                key={q.questionId || index}
                className={index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}
              >
                <td className="p-2" style={{ fontSize: "14px" }}>
                  {index + 1}
                </td>
                <td className="p-2" style={{ fontSize: "14px" }}>
                  {q.category || "N/A"}
                </td>
                <td className="p-2" style={{ fontSize: "14px" }}>
                  {q.description || "N/A"}
                </td>
                <td className="p-2" style={{ fontSize: "14px" }}>
                  {q.selectedAnswer === "None of the below"
                    ? "Yes"
                    : q.selectedAnswer || "No"}
                </td>
                <td className="p-2" style={{ fontSize: "14px" }}>
                  {q.marks || 0}
                </td>
                {target !== null && (
                  <>
                    <td className="p-2" style={{ fontSize: "14px" }}>
                      {target}
                    </td>
                    <td className="p-2" style={{ fontSize: "14px" }}>
                      {targetAnswer === "None of the below"
                        ? "Yes"
                        : targetAnswer || "N/A"}
                    </td>
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

export default HipaaAnswerTable;