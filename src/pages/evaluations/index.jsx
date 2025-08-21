import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { privateRequest } from "../../api/config";
import { capitalizeFirstLetter } from "../../lib/text";
import { FaEdit } from "react-icons/fa";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { LuFileSpreadsheet } from "react-icons/lu";

// Skeleton Loader Component
const SkeletonRow = () => (
  <div className="animate-pulse flex flex-row justify-between gap-4 py-4 border-b border-white/10">
    <div className="h-6 w-6 bg-slate-700 rounded" />
    <div className="h-6 w-40 bg-slate-700 rounded" />
    <div className="h-6 w-24 bg-slate-700 rounded-full" />
    <div className="h-8 w-8 bg-slate-700 rounded-full" />
  </div>
);

const SkeletonTable = () => (
  <div className="divide-y divide-white/10">
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

// Error Component
const ErrorBanner = ({ message }) => (
  <div className="bg-red-800 text-red-100 p-4 rounded-lg mb-4 border border-red-400">
    <strong>Error:</strong> {message}
  </div>
);

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true); // New state
  const [error, setError] = useState(null);     // New state

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await privateRequest.get("/nist-evaluation/assessments");
        setEvaluations(res.data.data);
        setError(null); // clear error if any
      } catch (error) {
        setError("Failed to fetch evaluations. Please try again.");
      } finally {
        setLoading(false);
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
          className={`my-2 px-2 py-1 rounded-full text-sm font-medium ${value === "submitted"
            ? "bg-green-300 text-green-800 font-semibold border-green-800"
            : "bg-orange-300 text-orange-700 font-semibold border-orange-700"
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
        if (row.status !== "submitted") {
          return (
            <button
              className="text-green-500 hover:text-green-600 bg-green-200 hover:bg-green-300 transition-all duration-300 p-2 rounded-full cursor-pointer"
              onClick={() => navigate(`/roadmap-analysis/questionnaire/nist/?evaluation-id=${row._id}`)}
            >
              <FaEdit />
            </button>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div className="bg-[#0f172a] py-10 px-6 w-screen min-h-screen text-white">
      <div className="flex flex-row w-full justify-between mb-6">
        <h1 className="text-xl font-bold">Evaluations</h1>
        <Button variant="tertiary" onClick={() => navigate("/roadmap-analysis/questionnaire/nist")}>
           <LuFileSpreadsheet size={20} />
          <span>Launch New Assessment</span>
        </Button>
       
      </div>

      {/* Error Banner */}
      {error && <ErrorBanner message={error} />}

      {/* Loader */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <Table config={config} data={evaluations} dark />
      )}
    </div>
  );
};

export default EvaluationsPage;
