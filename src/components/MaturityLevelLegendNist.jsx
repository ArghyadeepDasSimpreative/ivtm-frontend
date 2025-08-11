import { FaRegCircle } from "react-icons/fa";

const maturityLevels = [
  {
    label: "Adhoc",
    color: "text-blue-300",
    description: "Unstructured, reactive approach. No formal process.",
  },
  {
    label: "Define",
    color: "text-blue-400",
    description: "Basic policies and processes are defined.",
  },
  {
    label: "Manage",
    color: "text-blue-500",
    description: "Processes are implemented and repeatable.",
  },
  {
    label: "Proactive",
    color: "text-blue-600",
    description: "Threats are detected and responded to in real time.",
  },
  {
    label: "Optimised",
    color: "text-blue-700",
    description: "Continuously improving and fully integrated approach.",
  },
];

export default function MaturityLevelLegendNist() {
  return (
    <div className="bg-slate-900 rounded-[15px] p-6 w-full h-full">
      <div className="flex flex-col gap-2">
        {maturityLevels.map((level, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <FaRegCircle className={`${level.color} mt-1 text-lg`} />
            <div>
              <div className="text-sm font-semibold text-white">{level.label}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{level.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
