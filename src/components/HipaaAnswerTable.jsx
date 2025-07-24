import { useEffect, useState } from "react";

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

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        {target !== null ? `Target Comparison (Target: ${target})` : "All Questions"}
      </h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-700 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Category</th>
            <th className="p-2">Task</th>
            <th className="p-2">Answer</th>
            <th className="p-2">Score</th>
            {target !== null && (
              <>
                <th className="p-2">Target Value</th>
                <th className="p-2">Target Answer</th>
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
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{q.category || "N/A"}</td>
                <td className="p-2">{q.questionText || "N/A"}</td>
                <td className="p-2">
                  {q.selectedAnswer === "None of the below" ? "Yes" : q.selectedAnswer || "No"}
                </td>
                <td className="p-2">{q.marks || 0}</td>
                {target !== null && (
                  <>
                    <td className="p-2">{target}</td>
                    <td className="p-2">
                      {targetAnswer === "None of the below" ? "Yes" : targetAnswer || "N/A"}
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
