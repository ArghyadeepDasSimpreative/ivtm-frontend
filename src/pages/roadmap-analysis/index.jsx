import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaShieldAlt, FaLock, FaNetworkWired } from "react-icons/fa"
import Button from "../../components/Button"
import TreeDisplay from "../../components/TreeDisplay"
import MaturityLevelBarChart from "../../components/MaturityLevelBarChart"

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
]

const treeData = {
    function: "GOVERN",
    subcategories: [
        "GV.OC",
        "GV.RM",
        "GV.RR",
        "GV.PO",
        "GV.OV",
        "GV.SC"
    ]
}

export default function RoadmapAnalysis() {
  const [selected, setSelected] = useState("nist")
  const navigate = useNavigate()

  const handleProceed = () => {
    navigate(`/questionnaire/${selected}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Choose a Security Standard
      </h2>
      <p className="text-gray-400 text-center max-w-2xl mb-10">
        Select the cybersecurity framework you'd like to use for your roadmap
        analysis. Each option offers a different perspective to assess and
        improve your security maturity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        {standards.map((std) => {
          const isActive = selected === std.key
          return (
            <button
              key={std.key}
              onClick={() => setSelected(std.key)}
              className={`cursor-pointer flex flex-col items-start gap-4 p-6 rounded-xl border transition-all text-left h-full ${
                isActive
                  ? "border-sky-500 bg-slate-800 shadow-lg scale-[1.02]"
                  : "border-white/10 bg-slate-900 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 text-lg font-semibold text-white">
                <div className="text-sky-400">{std.icon}</div>
                {std.name}
              </div>
              <div className="text-gray-400 text-sm leading-relaxed">
                {std.description}
              </div>
            </button>
          )
        })}
      </div>

      <Button variant="primary" onClick={handleProceed}>
        Proceed to Questionnaire
      </Button>

      <MaturityLevelBarChart position={3} />
    </div>
  )
}
