import { useEffect, useState } from "react";
import { privateRequest } from "../../../api/config";
import CustomSelect from "../../../components/Select";
import Button from "../../../components/Button";
import { VscDebugStart } from "react-icons/vsc";
import { showToast } from "../../../lib/toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTargetMaturity } from "../../../context/TargetMaturityContext";

const TargetMaturityPageHipaa = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [targetOptions, setTargetOptions] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [loadingAssessmentDetails, setLoadingAssessmentDetails] = useState(false);
  const [averages, setAverages] = useState([]);

  const {
    setTargetLevelName,
    setTargetFunctionMarks,
    setTargetAverages,
    setHipaaTargetAssessment,
    hipaaTargetAssessment,
    hipaaTargetScore,
    setHipaaTargetScore
  } = useTargetMaturity();

  useEffect(() => {
    const loadAssessments = async () => {
      setLoadingAssessments(true);
      try {
        const { data } = await privateRequest.get("/hipaa-evaluations/assessments");
        const formatted = data.map((item) => ({
          label: `📝 ${format(new Date(item.timeTaken), "dd MMM yyyy, HH:mm")}`,
          value: item._id,
        }));
        setAssessments(formatted);
      } catch (err) {
        showToast.error("Failed to load assessments");
      } finally {
        setLoadingAssessments(false);
      }
    };

    loadAssessments();
  }, []);

  

  const handleAssessmentSelect = async (assessment) => {
    const { value: id, label } = assessment;
    setHipaaTargetAssessment({ id, label });
    setTargetLevelName(null);
    setLoadingAssessmentDetails(true);

    try {
      const { data } = await privateRequest.get(`/hipaa-evaluations/details/${id}`);

      const averageScore = Math.floor(data.average || 1);
      setCurrentLevel(averageScore);
      setAverages(data.categoryAverages || []);
      setTargetFunctionMarks(data.answers || []);
      setTargetAverages(data.categoryAverages || []);

      const options = [];
      for (let i = averageScore + 1; i <= 3; i++) {
        options.push({ label: `Level ${i} to ${i + 1}`, value: i });
      }
      setTargetOptions(options);
    } catch (err) {
      showToast.error("Failed to load HIPAA maturity data");
    } finally {
      setLoadingAssessmentDetails(false);
    }
  };

  const getAverageByCategory = (category) => {
    const found = averages.find((c) => c.category === category);
    return found?.average || "0.00";
  };

  const shimmerBox = (
    <div className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 animate-pulse h-[150px]"></div>
  );

  const navigateToComparisonPage = () => {
    navigate("/target-comparison/hipaa");
  };

  const HIPAA_CATEGORIES = [
    "Cybersecurity Best Practices",
    "Policies and Documentation",
    "Technical Safeguards",
    "Physical Safeguards",
    "Administrative Safeguards",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-900 min-h-screen text-white min-w-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">
        🎯 Set Your HIPAA Target Maturity
      </h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {loadingAssessments ? (
          <>
            <div className="h-[70px] bg-slate-800 rounded animate-pulse"></div>
            <div className="h-[70px] bg-slate-800 rounded animate-pulse"></div>
          </>
        ) : (
          <>
            <CustomSelect
              label="Select Assessment"
              data={assessments}
              onSelect={(assessment) => handleAssessmentSelect(assessment)}
              placeholder="Choose an assessment"
              width="100%"
              config={{ label: "label", key: "value" }}
            />

            {currentLevel !== null && (
              <CustomSelect
                label="Target Maturity Level"
                data={targetOptions}
                onSelect={(option) => setHipaaTargetScore(option.value)}
                placeholder="Select level"
                width="100%"
                config={{ label: "label", key: "value" }}
              />
            )}
          </>
        )}
      </div>

      {loadingAssessmentDetails ? (
        <div className="bg-slate-800 h-[60px] rounded animate-pulse mb-6"></div>
      ) : currentLevel !== null ? (
        <div className="bg-slate-800 rounded p-4 mb-6 text-lg shadow text-center">
          <span className="font-semibold text-slate-300">Current Maturity Level:</span>{" "}
          <span className="text-green-400 font-bold text-xl">
            {currentLevel} - {currentLevel + 1}
          </span>
        </div>
      ) : null}

      {hipaaTargetAssessment && (
        <div className="flex flex-col gap-4 items-center justify-between mb-6">
          <div className="bg-blue-800 text-blue-100 rounded p-4 text-center shadow">
            🎯 You selected <strong>{hipaaTargetScore} - {hipaaTargetScore + 1}</strong> as your
            target maturity. Let’s work toward it!
          </div>
          <Button onClick={navigateToComparisonPage}>
            <VscDebugStart className="h-5 w-5" />
            <span>Start</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {loadingAssessmentDetails
          ? Array(6)
              .fill(0)
              .map((_, i) => <div key={i}>{shimmerBox}</div>)
          : HIPAA_CATEGORIES.map((category) => (
              <div
                key={category}
                className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 hover:shadow-xl transition duration-200"
              >
                <h2 className="text-xl font-semibold text-slate-200 mb-1">{category}</h2>
                <p className="text-sm text-slate-400">
                  Avg Score: {getAverageByCategory(category)}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TargetMaturityPageHipaa;
