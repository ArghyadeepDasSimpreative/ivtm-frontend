import { useEffect, useState } from "react";
import { privateRequest } from "../../../api/config";
import CustomSelect from "../../../components/Select";
import { showToast } from "../../../lib/toast";
import { format } from "date-fns";
import Button from "../../../components/Button";
import { VscDebugStart } from "react-icons/vsc";
import { useTargetMaturity } from "../../../context/TargetMaturityContext";
import { useNavigate } from "react-router-dom";

const TargetMaturityPageC2m2 = () => {
    const navigate = useNavigate();

    const [assessments, setAssessments] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [targetOptions, setTargetOptions] = useState([]);
    const [domainWiseData, setDomainWiseData] = useState([]);

    const [loadingAssessments, setLoadingAssessments] = useState(false);
    const [loadingAssessmentDetails, setLoadingAssessmentDetails] = useState(false);

    const {
        targetLevelName, 
        setTargetAssessment,
        setTargetLevelName,
    } = useTargetMaturity();

    useEffect(() => {
        const loadAssessments = async () => {
            setLoadingAssessments(true);
            try {
                const { data } = await privateRequest.get("/c2m2-evaluations/assessments");
                const formatted = data.data.map((item) => ({
                    label: `📝 ${format(new Date(item.evaluationTime), "dd MMM yyyy, HH:mm")}`,
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

    const handleAssessmentSelect = async (option) => {
        const { value: id, label } = option;

        setTargetAssessment({ id, label });
        setTargetLevelName(null);
        setLoadingAssessmentDetails(true);

        if (!id) return;

        try {
            const res = await privateRequest.get(`/c2m2-evaluations/average/${id}`);
            if (res.status === 200) {
                const data = res.data.data || [];

                const domainMap = {};
                data.forEach((q) => {
                    if (!domainMap[q.domain]) domainMap[q.domain] = [];
                    domainMap[q.domain].push(q);
                });

                const domainData = Object.entries(domainMap).map(([domain, qs]) => {
                    const total = qs.reduce((sum, q) => sum + (q.marks || 0), 0);
                    return {
                        functionName: domain,
                        averageScore: parseFloat((total / qs.length).toFixed(2)),
                    };
                });

                const wholeTotalMarks = data.reduce((sum, q) => sum + (q.marks || 0), 0);
                const numberOfQuestions = data.length;
                const avg = Math.floor(wholeTotalMarks / numberOfQuestions);

                setDomainWiseData(domainData);
                setCurrentLevel(avg);

                const newLevels = [];
                for (let i = avg + 1; i <= 2; i++) {
                    newLevels.push({ label: `Level ${i} to ${i + 1}`, value: i });
                }
                setTargetOptions(newLevels);
            }
        } catch (err) {
            console.error(err);
            setDomainWiseData([]);
        } finally {
            setLoadingAssessmentDetails(false);
        }
    };

    function navigateToComparisonPage() {
        navigate("/roadmap-analysis/target-comparison/c2m2");
    }

    const shimmerBox = (
        <div className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 animate-pulse h-[150px]"></div>
    );

    return (
        <div className="p-6 mx-auto bg-slate-900 min-h-screen text-white w-full">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-300">
                🎯 Set Your Target Maturity (C2M2)
            </h1>

            {/* Select Assessment */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6 w-full">
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


            {targetLevelName && domainWiseData.length > 0 && (
                <div className="flex flex-col gap-4 items-center justify-between mb-6">
                    <div className="bg-blue-800 text-blue-100 rounded p-4 text-center shadow">
                        🎯 You selected <strong className="bg-blue-300 px-2 py-1 text-blue-950 font-semibold mx-1 rounded-md">{targetLevelName} - {targetLevelName + 1} </strong> as your target maturity. Let’s work toward it!
                    </div>
                    <Button onClick={navigateToComparisonPage}>
                        <VscDebugStart className="h-5 w-5" />
                        <span>Start</span>
                    </Button>
                </div>
            )}

            {/* Domain Wise Data Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {loadingAssessmentDetails
                    ? Array(6).fill(0).map((_, i) => <div key={i}>{shimmerBox}</div>)
                    : domainWiseData.map((d) => {

                        return (
                            <div
                                key={d.functionName}
                                className="bg-slate-800 rounded-lg p-5 flex flex-col items-center text-center border border-slate-700 hover:shadow-xl transition duration-200"
                            >
                                <h2 className="text-lg font-semibold text-slate-200 mb-1">{d.functionName}</h2>
                                <p className="text-sm text-slate-400">Avg Score:</p>
                                <p className="text-green-400 font-bold text-lg">{d.averageScore}</p>
                            </div>
                        )
                    }
                    )}
            </div>

        </div>
    );
};

export default TargetMaturityPageC2m2;
