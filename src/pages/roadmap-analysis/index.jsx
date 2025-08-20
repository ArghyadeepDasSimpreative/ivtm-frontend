import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaLock, FaNetworkWired } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import Button from "../../components/Button";
import Evaluations from "./Evaluations";

const standards = [
  {
    key: "nist",
    name: "NIST CSF",
    icon: <FaShieldAlt size={24} />,
    description:
      "The NIST Cybersecurity Framework (CSF) helps organizations to manage and reduce cybersecurity risk through structured functions.",
  },
  {
    key: "hipaa",
    name: "HIPAA",
    icon: <FaLock size={24} />,
    description:
      "The Health Insurance Portability and Accountability Act focuses on protecting sensitive patient health information.",
  },
  {
    key: "c2m2",
    name: "C2M2",
    icon: <FaNetworkWired size={24} />,
    description:
      "The Cybersecurity Capability Maturity Model (C2M2) helps organizations evaluate and improve cybersecurity capabilities.",
  },
];

const options = [
  {
    label: "Maturity Assessment and Roadmap Analysis",
    path: "/roadmap-analysis",
  },
  {
    label: "Vulnerability Management",
    path: "/vulnerability-management",
  },
  {
    label: "AI based Incident Management",
    path: null,
  },
];

export default function RoadmapAnalysis() {
  const [selected, setSelected] = useState("nist");
  const [chosenOption, setChosenOption] = useState(null);
  const [proceeded, setProceeded] = useState(false);

  const navigate = useNavigate();

  const handleProceed = () => {
    setProceeded(true);
    if (chosenOption === "Maturity Assessment and Roadmap Analysis") {
      return;
    } else {
      navigate("/vulnerability-management");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10 flex flex-col items-center">
      {chosenOption !== "Maturity Assessment and Roadmap Analysis" || !proceeded ? (
        <>
          {/* Welcome Section */}
          <h1 className="text-3xl font-bold mb-3 text-center">
            👋 Welcome to Your Cybersecurity Hub
          </h1>
          <p className="text-gray-400 mb-8 text-center max-w-xl">
            Let's start by choosing the area you'd like to explore. Each option
            offers powerful tools and assessments to strengthen your security posture.
          </p>

          {/* Options */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10 w-full max-w-3xl">
            {options.map((option) => (
              <button
                key={option.label}
                onClick={() => setChosenOption(option.label)}
                className={`cursor-pointer flex-1 px-6 py-5 rounded-2xl text-md font-medium transition-all duration-300 border text-white text-center
                  ${
                    chosenOption === option.label
                      ? "bg-sky-600 border-sky-500 shadow-xl scale-105"
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          
          <Button onClick={handleProceed}>
            <GrFormNextLink size={20} />
            <span>Proceed</span>
          </Button>
        </>
      ) : (
        <>
          {/* Standard Selection */}
          <h2 className="text-2xl font-bold mb-4 text-center">
            Choose Your Security Standard
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mb-10">
            Select the cybersecurity framework you'd like to use for your roadmap
            analysis. This will guide the structure and scope of your assessment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
            {standards.map((std) => {
              const isActive = selected === std.key;
              return (
                <button
                  key={std.key}
                  onClick={() => setSelected(std.key)}
                  className={`cursor-pointer flex flex-col items-start gap-4 p-6 rounded-xl border transition-all text-left h-full ${
                    isActive
                      ? "border-sky-500 bg-slate-800 shadow-lg scale-[1.02]"
                      : "border-white/10 bg-slate-900 hover:border-white/20 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center gap-3 text-md font-semibold text-white">
                    <div className="text-sky-400">{std.icon}</div>
                    {std.name}
                  </div>
                  <div className="text-gray-400 text-sm leading-relaxed">
                    {std.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Evaluation Table */}
          <div className="max-w-[80vw] flex justify-between">
            <Evaluations type={selected} />
          </div>
        </>
      )}
    </div>
  );
}
