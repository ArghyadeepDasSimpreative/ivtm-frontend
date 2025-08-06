import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { privateRequest } from "../../api/config";
import { capitalizeFirstLetter } from "../../lib/text";
import { FaEdit } from "react-icons/fa";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await privateRequest.get("/nist-evaluation/assessments");
        setEvaluations(res.data.data); // ✅ Corrected typo here
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
      }
    };

    fetchEvaluations();
  }, []);

  const config = [
    {
      key: "index",
      label: "No.",
      render: (_, __, idx) => idx + 1
    },
    {
      key: "evaluationTime",
      label: "Evaluation Time",
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`my-2 px-2 py-1 rounded-full text-sm font-medium ${value === "submitted" ? "bg-green-300 text-green-800 font-semibold" : "bg-orange-300 text-orange-700 font-semibold"
            }`}
        >
          {capitalizeFirstLetter(value)}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        // Only show the edit button if status is NOT "submitted"
        if (row.status !== "submitted") {
          return (
            <button className="text-green-500 hover:text-green-600 bg-green-200 hover:bg-green-300 transition-all duration-300 p-2 rounded-full cursor-pointer" onClick={()=>navigate(`/questionnaire/nist/?evaluation-id=${row._id}`)}>
              <FaEdit />
            </button>
          );
        }

        return null; // Don't render anything if already submitted
      }
    }
  ];

  return (
    <div className="bg-slate-950 py-10 px-6 w-screen min-h-screen text-white">
      <div className="flex flex-row w-full justify-between mb-3">
        <h1 className="text-2xl font-bold mb-4">Evaluations</h1>
        <Button variant="tertiary" onClick={() => navigate("/questionnaire/nist")}><span>Launch New Assessment</span></Button>
      </div>

      <Table config={config} data={evaluations} dark />
    </div>
  );
};

export default EvaluationsPage;
