import Table from "../../components/Table"

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const RESULT_OPTIONS = ["In Progress", "Closed", "Re-Opened"];

const SEVERITY_COLORS = {
  Critical: "#f2c4c2",
  High: "#ffd5d5",
  Medium: "#ffe7c7",
  Low: "#d2f5c7",
};

const TEXT_COLORS = {
  Critical: "#94130f",
  High: "#fc2b23",
  Medium: "#fc7b2b",
  Low: "#20ad0e",
};

export default function FilteredTablePage({ data, setUpdates }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;

    const item = updated[index];
    const newUpdate = { _id: item._id, result: item.result, priority: item.priority, [field]: value };

    setUpdates((prev) => {
      const existing = prev.find((u) => u._id === item._id);
      if (existing) {
        return prev.map((u) => (u._id === item._id ? newUpdate : u));
      } else {
        return [...prev, newUpdate];
      }
    });
  };

  const config = [
    {
      label: "SL No.",
      key: "serialNumber",
      render: (val, item, idx) => val || idx + 1,
    },
    {
      label: "Assessment Area",
      key: "assessmentArea",
    },
    {
      label: "Item Description",
      key: "description",
      render: (val) => <div className="whitespace-pre-line">{val}</div>,
    },
    {
      label: "Severity",
      key: "severity",
      render: (val) => (
        <span
          className="px-2 py-1 text-xs font-semibold rounded"
          style={{ backgroundColor: SEVERITY_COLORS[val], color: TEXT_COLORS[val] }}
        >
          {val}
        </span>
      ),
    },
    {
      label: "Priority",
      key: "priority",
      render: (val, item, idx) => (
        <select
          value={val}
          onChange={(e) => handleChange(idx, "priority", e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ),
    },
    {
      label: "Result",
      key: "status",
      render: (val, item, idx) => (
        <select
          value={val}
          onChange={(e) => handleChange(idx, "status", e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full bg-white"
        >
          {RESULT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return <Table label="Assessment Table" data={data} config={config} />;
}
