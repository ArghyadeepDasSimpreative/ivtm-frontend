import { useEffect, useState } from "react";
import { privateRequest } from "../../../api/config";
import CustomSelect from "../../../components/Select";
import {
    FaShieldAlt,
    FaEye,
    FaBullseye,
    FaSyncAlt,
    FaLock,
    FaBalanceScale
} from "react-icons/fa";
import { showToast } from "../../../lib/toast";
import { format } from "date-fns";
import Button from "../../../components/Button";
import { VscDebugStart } from "react-icons/vsc";
import { useTargetMaturity } from "../../../context/TargetMaturityContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";


const functionIcons = {
    IDENTIFY: <FaEye size={28} />,
    PROTECT: <FaShieldAlt size={28} />,
    DETECT: <FaBullseye size={28} />,
    RESPOND: <FaSyncAlt size={28} />,
    RECOVER: <FaLock size={28} />,
    GOVERN: <FaBalanceScale size={28} />,
};

const TargetMaturityPageNist = () => {
    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);
    // const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    // const [targetLevel, setTargetLevel] = useState(null);
    // const [functionMarks, setFunctionMarks] = useState({});
    const [targetOptions, setTargetOptions] = useState([]);
    const [averages, setAverages] = useState([]);

    const [loadingAssessments, setLoadingAssessments] = useState(false);
    const [loadingAssessmentDetails, setLoadingAssessmentDetails] = useState(false);

    useEffect(() => {
        const loadAssessments = async () => {
            setLoadingAssessments(true);
            try {
                const { data } = await privateRequest.get("/nist-evaluation/assessments");
                const formatted = data.data.map((item) => ({
                    label: `📝 ${format(new Date(item.evaluationTime), "dd MMM yyyy, HH:mm")}`,
                    value: item._id,
                }));
                setAssessments(formatted);
            } catch (err) {
                console.log(err)
                showToast.error("Failed to load assessments");
            } finally {
                setLoadingAssessments(false);
            }
        };
        loadAssessments();
    }, []);

    const {
        targetAssessment,
        setTargetAssessment,
        targetLevelName,
        setTargetLevelName,
        setTargetAverages,
        setTargetFunctionMarks,
    } = useTargetMaturity();


    const handleAssessmentSelect = async (assessment) => {
        const { value: id, label } = assessment;

        setTargetAssessment({ id, label });
        setTargetLevelName(null);
        setLoadingAssessmentDetails(true);

        try {
            const avgRes = await privateRequest.get(`/nist-evaluation/marks/function/${id}`);
            setTargetAverages(avgRes.data.result);

            const marksRes = await privateRequest.get(`/nist-evaluation/stats/${id}`);
            const avg = Math.floor(marksRes.data.average || 1);
            setCurrentLevel(avg);

            setTargetFunctionMarks(marksRes.data.answersGiven || []);

            const newLevels = [];
            for (let i = avg + 1; i <= 4; i++) {
                newLevels.push({ label: `Level ${i} to ${i + 1}`, value: i });
            }
            setTargetOptions(newLevels);
        } catch (err) {
            showToast.error("Failed to load maturity data");
        } finally {
            setLoadingAssessmentDetails(false);
        }
    };


    const getAveragePerFunction = (functionName) => {
        const found = averages?.find(avg => avg.functionName === functionName.toUpperCase());
        return found?.averageScore || "0.00";
    };

    const shimmerBox = (
        <div className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 animate-pulse h-[150px]"></div>
    );

    function navigateToComparisonPage() {
          navigate(`/roadmap-analysis/target-comparison/nist/?evaluation-id=${targetAssessment.id}`)
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-slate-900 min-h-screen text-white min-w-screen">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-300">🎯 Set Your Target Maturity</h1>

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
                                onSelect={(option) => setTargetLevelName(option.value)}
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
                <div className="bg-slate-800 rounded p-4 mb-6 text-md shadow text-center">
                    <span className="font-semibold text-slate-300">Current Maturity Level:</span>{" "}
                    <span className="text-green-400 font-bold text-lg">{currentLevel} - {currentLevel + 1}</span>
                </div>
            ) : null}

            {targetLevelName && currentLevel && (
                <div className="flex flex-col gap-4 items-center justify-between mb-6">
                    <div className="bg-blue-800 text-blue-100 rounded p-4 text-center shadow">
                        🎯 You selected <strong className="bg-blue-300 px-2 py-1 text-blue-950 font-semibold mx-1 rounded-md">{targetLevelName} - {targetLevelName+1} </strong> as your target maturity. Let’s work toward it!
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
                    : ["IDENTIFY", "PROTECT", "DETECT", "RESPOND", "RECOVER", "GOVERN"].map((fn) => (
                        <div
                            key={fn}
                            className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 hover:shadow-xl transition duration-200"
                        >
                            <div className="mb-3 text-blue-400">{functionIcons[fn]}</div>
                            <h2 className="text-lg font-semibold text-slate-200 mb-1">{fn}</h2>
                            <p className="text-sm text-slate-400">Avg Score: {getAveragePerFunction(fn)}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default TargetMaturityPageNist;
