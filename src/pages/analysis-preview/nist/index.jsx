import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../../api/config";

import CustomSelect from "../../../components/Select";
import MaturityLevelBarChart from "../../../components/MaturityLevelBarChart";
import RadarChartComponent from "../../../components/RadarChartComponent";
import CategorisedBarChart from "../../../components/CategorisedBarChart";
import MultiLineChart from "../../../components/MultiLineChart";
import MaturityLevelLegend from "../../../components/MaturityLevelLegend";
import FunctionAnswerTable from "../../../components/FunctionAnswerTable";
import { showToast } from "../../../lib/toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "../../../components/Button";

const NistAnalysisPreview = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assessmentsList, setAssessmentsList] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [functionWiseMarks, setFunctionWiseMarks] = useState([]);
    const [selectedFunctionName, setSelectedFunctionName] = useState("");
    const exportRef = useRef();

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
        setSelectedFunctionName(""); // Reset on new selection

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
                backgroundColor: "#0f172a", // Same as bg-slate-950
            });

            console.log("canvas is ")

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            console.log("pdf is ", pdf)

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
                    {/* Dropdown */}
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
                                {/* Top Row: Score, Maturity Bar, Legend */}
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                    {/* Overall Score */}
                                    <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                        <h2 className="text-xl font-semibold text-blue-300">Overall Score</h2>
                                        <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                                    </div>

                                    {/* Maturity Bar and Legend */}
                                    <div className="flex gap-10 justify-end items-center">
                                        <MaturityLevelBarChart position={parseInt(evaluationStats.average)} />
                                        <MaturityLevelLegend />
                                    </div>
                                </div>

                                {/* Graph Row */}
                                <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
                                    {functionWiseMarks?.length > 0 && (
                                        <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                            <MultiLineChart
                                                dataSets={[{ label: "Score", data: functionWiseMarks }]}
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <RadarChartComponent
                                            dataSets={
                                                [{name: "Function wise average",data: functionWiseMarks}]
                                        }
                                            label="Function-wise Maturity Radar"
                                            notation="Each axis represents a function's average score (Max: 5)"
                                        />
                                    </div>

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <CategorisedBarChart
                                            datasets={[{name: "", data:functionWiseMarks, color: "#22d3ee"}]}
                                            title="Function-Wise Scores"
                                            note="Average scores per function (0 to 5)"
                                            handleClick={handleBarClick}
                                        />
                                    </div>
                                </div>

                                {/* Function Table */}
                                <FunctionAnswerTable
                                    evaluationId={evaluationStats?.evaluationId}
                                    functionName={selectedFunctionName}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NistAnalysisPreview;
