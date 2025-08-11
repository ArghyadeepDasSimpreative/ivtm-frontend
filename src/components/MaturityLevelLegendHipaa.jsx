import { FaRegCircle } from "react-icons/fa";

const hipaaLevels = [
  {
    label: "Physical",
    color: "text-blue-300",
    description: "Safeguards that protect physical access to ePHI and related facilities.",
  },
  {
    label: "Administrative",
    color: "text-blue-400",
    description: "Policies and procedures to manage security measures and staff responsibilities.",
  },
  {
    label: "Technical",
    color: "text-blue-500",
    description: "Technology and related policies to protect and control access to ePHI.",
  },
  {
    label: "Policy, Procedure and Documentation",
    color: "text-blue-600",
    description: "Documented processes for implementing and maintaining compliance effectively.",
  },
];

export default function MaturityLevelLegendHipaa() {
  return (
    <div className="bg-slate-900 rounded-[15px] p-6 w-full h-full">
      <div className="flex flex-col gap-6">
        {hipaaLevels.map((level, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <FaRegCircle className={`${level.color} mt-1 text-md`} />
            <div>
              <div className="text-md font-semibold text-white">{level.label}</div>
              <div className="text-gray-400 text-md leading-relaxed">{level.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
