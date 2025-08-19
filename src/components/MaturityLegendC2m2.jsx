import { FaRegCircle } from "react-icons/fa";

const c2m2Domains = [
  {
    label: "ACCESS",
    color: "text-blue-300",
    description: "Manage and restrict access to critical assets and information systems securely.",
  },
  {
    label: "ARCHITECTURE",
    color: "text-blue-400",
    description: "Establish secure system design principles and resilient infrastructure architecture.",
  },
  {
    label: "ASSET",
    color: "text-blue-500",
    description: "Identify, manage, and track critical assets across the organization effectively.",
  },
  {
    label: "PROGRAM",
    color: "text-blue-600",
    description: "Govern and maintain cybersecurity strategy, objectives, and organizational program alignment.",
  },
  {
    label: "RESPONSE",
    color: "text-indigo-400",
    description: "Detect, respond, and recover quickly from cybersecurity incidents and threats.",
  },
  {
    label: "RISK",
    color: "text-indigo-500",
    description: "Assess, prioritize, and mitigate cybersecurity risks to business operations continuously.",
  },
  {
    label: "SITUATION",
    color: "text-indigo-600",
    description: "Maintain situational awareness of cyber threats, vulnerabilities, and operating environment.",
  },
  {
    label: "THIRD-PARTIES",
    color: "text-purple-400",
    description: "Manage cybersecurity risks posed by vendors, partners, and external service providers.",
  },
  {
    label: "THREAT",
    color: "text-purple-500",
    description: "Identify, analyze, and respond to evolving internal and external cyber threats.",
  },
  {
    label: "WORKFORCE",
    color: "text-purple-600",
    description: "Develop, train, and equip staff with cybersecurity skills and responsibilities.",
  },
];

export default function MaturityLevelLegendC2m2() {
  return (
    <div className="bg-slate-900 rounded-[15px] p-6 w-full h-full border border-blue-400">
      <div className="flex flex-col gap-6 h-[48vh] overflow-y-auto custom-scrollbar">
        {c2m2Domains.map((domain, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <FaRegCircle className={`${domain.color} mt-1 text-md`} />
            <div>
              <div className="text-md font-semibold text-white">{domain.label}</div>
              <div className="text-gray-400 text-md leading-relaxed">{domain.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
