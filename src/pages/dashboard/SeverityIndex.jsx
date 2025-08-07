import { FaCircle } from "react-icons/fa";

const defaultColors = ["#94130f", "#fc2b23", "#fc7b2b", "#20ad0e"];

const SEVERITY_LABELS = [
  {
    label: "Critical",
    description: "Immediate threat to key business processes.",
  },
  {
    label: "High",
    description: "Direct threat to key business processes.",
  },
  {
    label: "Medium",
    description: "Indirect or partial threat to key business processes.",
  },
  {
    label: "Low",
    description: "No direct threat exists. May be exploited using other vulnerabilities.",
  },
];

export default function SeverityIndex({ colors = defaultColors }) {
  return (
    <div className="border border-zinc-200 rounded-xl p-4 w-full max-w-xl shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Severity Scoring</h2>
      <div className="space-y-3">
        {SEVERITY_LABELS.map((item, index) => (
          <div key={item.label} className="flex items-start space-x-3">
            <FaCircle color={colors[index]} size={12} className="mt-1" />
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-zinc-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
