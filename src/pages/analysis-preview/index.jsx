import { useEffect, useState } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../api/config";
import CustomSelect from "../../components/Select";
import MaturityLevelBarChart from "../../components/MaturityLevelBarChart";
import RadarChartComponent from "../../components/RadarChartComponent";
import FunctionWiseBarChart from "../../components/FunctionWiseBarChart";

const AnalysisPreview = () => {
    const [pageLoading, setPageLoading] = useState(true);
    const [assessmentsList, setAssessmentsList] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [pageError, setPageError] = useState("");
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [functionWiseMarks, setFunctionWiseMarks] = useState([]);

    const fetchInitialData = async () => {
        try {
            const response = await privateRequest.get("/nist-evaluation/assessments");
            if (response.status === 200) {
                const mapped = response.data.assessments.map((item) => ({
                    ...item,
                    formattedDate: format(new Date(item.evaluationTime), "dd MMM yyyy, hh:mm a"),
                    value: item._id,
                }));
                setAssessmentsList(mapped);
            } else {
                throw new Error("Error fetching assessments");
            }
        } catch (err) {
            setPageError(err?.response?.data?.message || "Error fetching assessments");
        } finally {
            setPageLoading(false);
        }
    };

    const handleAssessmentChange = async (option) => {
        const evaluationId = option?.value;
        setSelectedId(evaluationId);

        if (!evaluationId) {
            setEvaluationStats(null);
            setFunctionWiseMarks([]);
            return;
        }

        try {
            const [statsRes, radarRes] = await Promise.all([
                privateRequest.get(`/nist-evaluation/stats/${evaluationId}`),
                privateRequest.get(`/nist-evaluation/marks/function/${evaluationId}`),
            ]);

            setEvaluationStats(statsRes.status === 200 ? statsRes.data : null);
            setFunctionWiseMarks(radarRes.status === 200 ? radarRes.data.result || [] : []);
        } catch (err) {
            setEvaluationStats(null);
            setFunctionWiseMarks([]);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div className="bg-slate-950 min-h-screen w-full p-8 text-white">
            {pageLoading ? (
                <p className="text-blue-300 text-lg">Loading...</p>
            ) : pageError ? (
                <p className="text-red-500">{pageError}</p>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                        <div className="w-[300px]">
                            <CustomSelect
                                label="Select Assessment"
                                data={assessmentsList}
                                config={{ key: "_id", label: "formattedDate" }}
                                onSelect={handleAssessmentChange}
                                width="300px"
                            />
                        </div>
                    </div>

                    {evaluationStats && (
                        <div className="flex flex-col gap-10">
                            {/* Overall Score Section */}
                            <div className="flex w-full justify-around">
                                <div className="bg-slate-900 border border-blue-400 rounded-md w-[400px] h-[200px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                    <h2 className="text-2xl font-semibold text-blue-300">Overall Score</h2>
                                    <p className="text-5xl font-bold mt-3 text-blue-100">{evaluationStats.average}</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <MaturityLevelBarChart position={parseInt(evaluationStats.average)} />
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="flex flex-col lg:flex-row gap-10 w-full justify-around items-start">
                                {functionWiseMarks.length > 0 && (
                                    <RadarChartComponent
                                        data={functionWiseMarks}
                                        label="Function-wise Maturity Radar"
                                        notation="Each axis represents a function's average score (Max: 5)"
                                    />
                                )}
                                {functionWiseMarks.length > 0 && (
                                    <FunctionWiseBarChart
                                        data={functionWiseMarks}
                                        title="Function-Wise Scores"
                                        note="Average scores per function (0 to 5)"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalysisPreview;
