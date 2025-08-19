import { FaRegCircle } from "react-icons/fa";

const c2m2Domains = [
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
  }
];

export default function MaturityLevelLegendC2m2() {
  return (
    <div className="bg-slate-900 rounded-[15px] p-6 w-full h-full border border-blue-400">
      <div className="flex flex-col gap-6 h-auto">
        {c2m2Domains.map((domain, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <FaRegCircle className={`${domain.color} mt-1 text-sm`} />
            <div>
              <div className="text-sm font-semibold text-white">{domain.label}</div>
              <div className="text-gray-400 text-sm leading-relaxed">{domain.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
