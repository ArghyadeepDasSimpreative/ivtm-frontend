import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../api/config";
import { useTargetMaturity } from "../../context/TargetMaturityContext";

import CustomSelect from "../../components/Select";
import MaturityLevelBarChart from "../../components/MaturityLevelBarChart";
import RadarChartComponent from "../../components/RadarChartComponent";
import FunctionWiseBarChart from "../../components/FunctionWiseBarChart";
import MultiLineChart from "../../components/MultiLineChart";
import MaturityLevelLegend from "../../components/MaturityLevelLegend";
import FunctionAnswerTable from "../../components/FunctionAnswerTable";
import { showToast } from "../../lib/toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "../../components/Button";

const TargetComparison = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assessmentsList, setAssessmentsList] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [functionWiseMarks, setFunctionWiseMarks] = useState([]);
    const [selectedFunctionName, setSelectedFunctionName] = useState("");
    const [targetData, setTargetData] = useState([])
    const exportRef = useRef();

    const {
        targetLevelName,
        targetFunctionMarks,
        setTargetAssessment,
    } = useTargetMaturity();

    useEffect(function () {
        setTargetData([
            {
                functionName: "GOVERN",
                averageScore: targetLevelName
            },
            {
                functionName: "IDENTIFY",
                averageScore: targetLevelName
            },
            {
                functionName: "PROTECT",
                averageScore: targetLevelName
            },
            {
                functionName: "DETECT",
                averageScore: targetLevelName
            },
            {
                functionName: "RESPOND",
                averageScore: targetLevelName
            },
            {
                functionName: "RECOVER",
                averageScore: targetLevelName
            }
        ])
    }, [targetLevelName])

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await privateRequest.get("/nist-evaluation/assessments");
                if (response.status === 200) {
                    const formatted = response.data.assessments.map((item) => ({
                        ...item,
                        formattedDate: format(new Date(item.evaluationTime), "dd MMM yyyy, hh:mm a"),
                        value: item._id,
                    }));
                    setAssessmentsList(formatted);
                } else {
                    throw new Error("Failed to fetch assessments.");
                }
            } catch (err) {
                setError(err?.response?.data?.message || "Error fetching assessments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    function handleBarClick(param) {
        showToast.success(`Showing data for function ${param}`);
        setSelectedFunctionName(param);
    }

    const handleAssessmentChange = async (option) => {
        const id = option?.value;
        setSelectedId(id);
        setEvaluationStats(null);
        setFunctionWiseMarks([]);
        setSelectedFunctionName("");
        setTargetAssessment(option); // push to context

        if (!id) return;

        try {
            const [statsRes, functionMarksRes] = await Promise.all([
                privateRequest.get(`/nist-evaluation/stats/${id}`),
                privateRequest.get(`/nist-evaluation/marks/function/${id}`),
            ]);

            setEvaluationStats(statsRes.status === 200 ? statsRes.data : null);
            const cleanedData = (functionMarksRes.data.result || []).map(item => ({
                ...item,
                averageScore: parseFloat(item.averageScore),
            }));
            setFunctionWiseMarks(cleanedData);
        } catch {
            setEvaluationStats(null);
            setFunctionWiseMarks([]);
            setSelectedFunctionName("");
        }
    };

    const handleDownloadPdf = async () => {
        try {
            showToast.info("PDF generation started...");
            const canvas = await html2canvas(exportRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: "#0f172a",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("evaluation_report.pdf");

            showToast.success("PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF download error:", error);
            showToast.error("PDF download failed!");
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen text-white p-8">
            {loading ? (
                <p className="text-blue-300 text-lg">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-center">
                        <CustomSelect
                            label="Select Assessment"
                            data={assessmentsList}
                            config={{ key: "_id", label: "formattedDate" }}
                            onSelect={handleAssessmentChange}
                            width="300px"
                        />
                        {evaluationStats && (
                            <Button onClick={handleDownloadPdf}>Download PDF</Button>
                        )}
                    </div>

                    <div ref={exportRef}>
                        {evaluationStats && (
                            <div className="flex flex-col gap-10 mt-7">
                                {/* Top Row */}
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                    <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                        <h2 className="text-xl font-semibold text-blue-300">Overall Score</h2>
                                        <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                                    </div>

                                    <div className="flex gap-10 justify-end items-center">
                                        <MaturityLevelBarChart
                                            position={parseInt(evaluationStats.average)}
                                            target={parseInt(targetLevelName)}
                                        />
                                        <MaturityLevelLegend />
                                    </div>
                                </div>

                                {/* Graph Row */}
                                <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
                                    {functionWiseMarks?.length > 0 && (
                                        <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                            <MultiLineChart
                                                dataSets={[
                                                    { label: "Actual", data: functionWiseMarks },
                                                    { label: "Target", data: targetData }
                                                ]}
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <RadarChartComponent
                                            dataSets={[
                                                { name: "Current", data: functionWiseMarks },
                                                { name: "Target", data: targetData }
                                            ]}
                                            label="Function-wise Maturity Radar"
                                            notation="Each axis represents a function's average score (Max: 5)"
                                        />

                                    </div>

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <FunctionWiseBarChart
                                            datasets={[
                                                { name: "Actual", data: functionWiseMarks, color: "#3b82f6" },
                                                { name: "Target", data: targetData, color: "#f97316" }
                                            ]}
                                            title="Function-Wise Scores"
                                            note="Average scores per function (0 to 5)"
                                            handleClick={handleBarClick}
                                        />

                                    </div>
                                </div>

                                {/* Table */}
                                <FunctionAnswerTable
                                    evaluationId={evaluationStats?.evaluationId}
                                    functionName={selectedFunctionName}
                                    target={targetLevelName}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TargetComparison;
