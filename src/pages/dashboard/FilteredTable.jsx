import React, { useState, useEffect } from "react";

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const RESULT_OPTIONS = ["In Progress", "Closed", "Re-Opened"];

const SEVERITY_COLORS = {
  Critical: "#f2c4c2",
  High: "#ffd5d5",
  Medium: "#ffe7c7",
  Low: "#d2f5c7"
};

const TEXT_COLORS = {
  Critical: "#94130f",
  High: "#fc2b23",
  Medium: "#fc7b2b",
  Low: "#20ad0e"
};

export default function FilteredTable({ data, setUpdates }) {
  const [tableData, setTableData] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {

      setTableData(data);
      setUpdatedItems([]);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    console.log("changing field:", field, "to value:", value, "at index:", index);
    const updated = [...tableData];
    updated[index][field] = value;
    setTableData(updated);


    const item = updated[index];
    const newUpdate = { _id: item._id, result: item.result, priority: item.priority, [field]: value };

    setUpdatedItems((prev) => {
      const existing = prev.find((u) => u._id === item._id);
      if (existing) {
        return prev.map((u) => (u._id === item._id ? newUpdate : u));
      } else {
        return [...prev, newUpdate];
      }
    });
  };

  useEffect(() => {
    if (typeof setUpdates === "function") {
      setUpdates(updatedItems);
    }
  }, [updatedItems, setUpdates]);

  if (!tableData.length) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center shadow rounded bg-white">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full mt-6 shadow rounded bg-white h-[40vh]">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 font-medium">
          <tr>
            <th className="px-4 py-3 border border-transparent">SL No.</th>
            <th className="px-4 py-3 border border-transparent">Assessment Area</th>
            <th className="px-4 py-3 border border-transparent w-[25%]">Item Description</th>
            <th className="px-4 py-3 border border-transparent">Severity</th>
            <th className="px-4 py-3 border border-transparent">Priority</th>
            <th className="px-4 py-3 border border-transparent">Result</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, idx) => {
            console.log("Rendering item:", item, "at index:", idx);
            return (
              <tr
                key={item._id || idx}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="px-4 py-2 border border-transparent">{item.serialNumber || idx + 1}</td>
                <td className="px-4 py-2 border border-transparent">{item.assessmentArea}</td>
                <td className="px-4 py-2 border border-transparent w-[25%] whitespace-pre-line">
                  {item.description}
                </td>
                <td className="px-4 py-2 border border-transparent">
                  <span
                    className="px-2 py-1 text-xs font-semibold rounded"
                    style={{
                      backgroundColor: SEVERITY_COLORS[item.severity],
                      color: TEXT_COLORS[item.severity]
                    }}
                  >
                    {item.severity}
                  </span>
                </td>
                <td className="px-4 py-2 border border-transparent">
                  <select
                    value={item.priority}
                    onChange={(e) => handleChange(idx, "priority", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 border border-transparent">
                  <select
                    value={item.status}
                    onChange={(e) => handleChange(idx, "status", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
                  >
                    {RESULT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          }

          )}
        </tbody>
      </table>
    </div >
  );
}
