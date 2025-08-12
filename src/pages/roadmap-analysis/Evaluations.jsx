import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { privateRequest } from "../../api/config";
import { capitalizeFirstLetter } from "../../lib/text";
import { FaEdit, FaEye } from "react-icons/fa";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

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

const Evaluations = ({ type = "nist" }) => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoint selection based on type
  const endpointMap = {
    nist: "/nist-evaluation/assessments",
    hipaa: "/hipaa-evaluations/assessments"
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const res = await privateRequest.get(endpointMap[type]);
        setEvaluations(type == "nist" ? res.data.data : res.data.data);
        setError(null);
      } catch (error) {
        setError(`Failed to fetch ${type.toUpperCase()} evaluations. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [type]);

  // Table config for NIST
  const nistConfig = [
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
        return (<div className="flex gap-2">
          {
            row.status !== "submitted" ?
              <button
                className="text-indigo-500 hover:text-indigo-600 bg-indigo-200 hover:bg-indigo-300 transition-all duration-300 p-2 rounded-full cursor-pointer"
                onClick={() => navigate(`/roadmap-analysis/questionnaire/nist/?evaluation-id=${row._id}`)}
              >
                <FaEdit />
              </button>
              :
               <button className="text-blue-500 hover:text-blue-600 bg-blue-200 hover:bg-blue-300 transition-all duration-300 p-2 rounded-full cursor-pointer" onClick={()=>navigate(`/roadmap-analysis/analysis-preview/nist/?evaluation-id=${row._id}`)}><FaEye /></button>
          }
         
        </div>)

      }
    }
  ];

  // Table config for HIPAA
  const hipaaConfig = [
    {
      key: "index",
      label: "No.",
      render: (_, __, idx) => idx + 1
    },
    {
      key: "timeTaken",
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
        return (<div className="flex gap-2">
          
               <button className="text-blue-500 hover:text-blue-600 bg-blue-200 hover:bg-blue-300 transition-all duration-300 p-2 rounded-full cursor-pointer" onClick={()=>navigate(`/roadmap-analysis/analysis-preview/hipaa/?evaluation-id=${row._id}`)}><FaEye /></button>
         
        </div>)

      }
    }
  ];

  // Pick config dynamically
  const config = type === "nist" ? nistConfig : hipaaConfig;

  return (
    <div className="bg-[#0f172a] py-10 px-6 w-screen min-h-screen text-white">
      <div className="flex flex-row w-full justify-end mb-6">
        <Button
          variant="tertiary"
          onClick={() =>
            navigate(type === "nist" ? "/roadmap-analysis/questionnaire/nist" : "/questionnaire/hipaa")
          }
        >
          <span>Launch New Assessment</span>
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <SkeletonTable />
      ) : (
        <Table config={config} data={evaluations} dark />
      )}
    </div>
  );
};

export default Evaluations;
