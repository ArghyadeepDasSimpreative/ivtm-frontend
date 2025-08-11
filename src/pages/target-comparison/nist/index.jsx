import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../../api/config";
import { useTargetMaturity } from "../../../context/TargetMaturityContext";

import CustomSelect from "../../../components/Select";
import MaturityLadder from "../../../components/MaturityLadder";
import RadarChartComponent from "../../../components/RadarChartComponent";
import CategorisedBarChart from "../../../components/CategorisedBarChart";
import MultiLineChart from "../../../components/MultiLineChart";
import MaturityLevelLegendNist from "../../../components/MaturityLevelLegendNist";
import FunctionAnswerTable from "../../../components/FunctionAnswerTable";
import { showToast } from "../../../lib/toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { IoDownloadOutline } from "react-icons/io5";

const TargetComparisonNist = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assessmentsList, setAssessmentsList] = useState([]);
    // const [selectedId, setSelectedId] = useState("");
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [functionWiseMarks, setFunctionWiseMarks] = useState([]);
    const [selectedFunctionName, setSelectedFunctionName] = useState("");
    const [targetData, setTargetData] = useState([])
    const exportRef = useRef();

    const navigate = useNavigate();

    const {
        targetLevelName,
        // targetFunctionMarks,
        setTargetAssessment,
    } = useTargetMaturity();


    useEffect(function () {
        if (!targetLevelName) {
            showToast.info("Please select you target maturity level first.")
            navigate("/target-maturity/nist");
        }
        setTargetData([
            {
                functionName: "GOVERN",
                averageScore: targetLevelName + 1
            },
            {
                functionName: "IDENTIFY",
                averageScore: targetLevelName + 1
            },
            {
                functionName: "PROTECT",
                averageScore: targetLevelName + 1
            },
            {
                functionName: "DETECT",
                averageScore: targetLevelName + 1
            },
            {
                functionName: "RESPOND",
                averageScore: targetLevelName + 1
            },
            {
                functionName: "RECOVER",
                averageScore: targetLevelName + 1
            }
        ])
    }, [targetLevelName])

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await privateRequest.get("/nist-evaluation/assessments");
                if (response.status === 200) {
                    const formatted = response.data.data.map((item) => ({
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
        // setSelectedId(id);
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

            setEvaluationStats(statsRes.status === 200 ? statsRes.data.data : null);
            setFunctionWiseMarks(functionMarksRes.data.data);
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
                <p className="text-blue-300 text-md">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col gap-10">
                    <p className="w-full text-center text-2xl font-semibold text-blue-200">Assessment result based on <strong className="text-blue-400">NIST CSF</strong></p>
                    <div className="flex justify-between items-center">
                        <CustomSelect
                            label="Select Assessment"
                            data={assessmentsList}
                            config={{ key: "_id", label: "formattedDate" }}
                            onSelect={handleAssessmentChange}
                            width="300px"
                        />
                        {evaluationStats && (
                            <Button onClick={handleDownloadPdf}>
                                <IoDownloadOutline size={22} />
                                Download PDF</Button>
                        )}
                    </div>

                    <div ref={exportRef}>
                        {evaluationStats && (
                            <div className="flex flex-col gap-10 mt-7">
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                    <div className="flex flex-col justify-between items-center w-auto gap-10">
                                        <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                            <h2 className="text-lg font-semibold text-blue-300">Overall Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                                        </div>
                                        <div className="bg-slate-900 border border-orange-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-orange-700/30">
                                            <h2 className="text-lg font-semibold text-blue-300">Target Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-orange-300">{targetLevelName + 1}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-10 justify-end items-start">
                                        <MaturityLadder
                                            position={parseInt(evaluationStats.average)}
                                            target={parseInt(targetLevelName)}
                                            levels={[
                                                { label: "Adhoc" },
                                                { label: "Define" },
                                                { label: "Manage" },
                                                { label: "Proactive detection" },
                                                { label: "Optimised" }
                                            ]}
                                        />
                                        <MaturityLevelLegendNist />
                                    </div>
                                </div>

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
                                        <CategorisedBarChart
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

                                <FunctionAnswerTable
                                    evaluationId={evaluationStats?.evaluationId}
                                    functionName={selectedFunctionName}
                                    target={targetLevelName + 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TargetComparisonNist;
