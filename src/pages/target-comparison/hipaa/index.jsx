import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../../api/config";

import CustomSelect from "../../../components/Select";
import MaturityLevelBarChart from "../../../components/MaturityLevelBarChart";
import RadarChartComponent from "../../../components/RadarChartComponent";
import CategorisedBarChart from "../../../components/CategorisedBarChart";
import MultiLineChart from "../../../components/MultiLineChart";
import { showToast } from "../../../lib/toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "../../../components/Button";
import HipaaAnswerTable from "../../../components/HipaaAnswerTable";
import { useTargetMaturity } from "../../../context/TargetMaturityContext";
import MaturityLevelLegendHipaa from "../../../components/MaturityLevelLegendHipaa";
import { useNavigate } from "react-router-dom";

const TargetComparisonHipaa = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assessmentsList, setAssessmentsList] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [categoryWiseScore, setCategoryWiseScore] = useState([]);
    const [categoryWiseTargetScore, setCategoryWiseTargetScore] = useState([]);
    //   const [maturityDistribution, setMaturityDistribution] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [answersGiven, setAnswersGiven] = useState([]);

    const navigate = useNavigate()

    const exportRef = useRef();

    const {
        hipaaTargetScore
    } = useTargetMaturity();

    useEffect(function() {
    console.log("hipaa target assessment is ", hipaaTargetScore)
    console.log("hipaa target assessment changed ", hipaaTargetScore)
    if(!hipaaTargetScore){
      showToast.info("Please select you target maturity level first.")
      navigate("/target-maturity/hipaa")
    }
  }, [])

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await privateRequest.get("/hipaa-evaluations/assessments");
                if (response.status === 200) {
                    const formatted = response.data.map((item) => ({
                        ...item,
                        formattedDate: format(new Date(item.timeTaken), "dd MMM yyyy, hh:mm a"),
                        value: item._id,
                    }));
                    setAssessmentsList(formatted);
                } else {
                    throw new Error("Failed to fetch HIPAA assessments.");
                }
            } catch (err) {
                setError(err?.response?.data?.message || "Error fetching assessments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const handleBarClick = (param) => {
        showToast.success(`Showing data for category ${param}`);
        setSelectedCategoryName(param);
    };

    const handleAssessmentChange = async (option) => {
        const id = option?.value;
        setSelectedId(id);
        setEvaluationStats(null);
        setCategoryWiseScore([]);
        // setMaturityDistribution([]);
        setSelectedCategoryName("");

        if (!id) return;

        try {
            const res = await privateRequest.get(`/hipaa-evaluations/details/${id}`);
            if (res.status === 200) {
                const data = res.data;

                const categoryWise = (data.categoryAverages || []).map((item) => ({
                    functionName: item.category,
                    averageScore: parseFloat(item.average),
                }));

                const categoryWiseTarget = (data.categoryAverages || []).map((item) => ({
                    functionName: item.category,
                    averageScore: hipaaTargetScore + 1,
                }));

                setCategoryWiseTargetScore(categoryWiseTarget);



                const maturityData = Object.entries(data.maturityDistribution || {}).map(
                    ([level, count]) => ({ level, count })
                );

                setEvaluationStats({ average: data.totalAverage, evaluationId: id });
                setCategoryWiseScore(categoryWise);
                // setMaturityDistribution(maturityData);
                setAnswersGiven(data.answers)
            }
        } catch (err) {
            setEvaluationStats(null);
            setCategoryWiseScore([]);
            //   setMaturityDistribution([]);
            showToast.error("Failed to load evaluation details.");
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
            pdf.save("hipaa_evaluation_report.pdf");

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
                    <p className="w-full text-center text-3xl font-semibold text-blue-200">Assessment result based on <strong className="text-blue-400">HIPAA</strong> compliance</p>
                    {/* Dropdown */}
                    <div className="flex justify-between items-center">
                        <CustomSelect
                            label="Select HIPAA Assessment"
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
                                    {/* Overall Score */}
                                    <div className="flex flex-col justify-between items-center w-auto gap-10">
                                        <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                            <h2 className="text-xl font-semibold text-blue-300">Overall Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                                        </div>
                                        <div className="bg-slate-900 border border-orange-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-orange-700/30">
                                            <h2 className="text-xl font-semibold text-blue-300">Target Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-orange-300">{hipaaTargetScore + 1}</p>
                                        </div>
                                    </div>

                                    {/* Maturity Chart */}
                                    <div className="flex gap-10 justify-end items-center">
                                        <MaturityLevelBarChart position={parseInt(evaluationStats.average)}
                                            levels={[
                                                { label: "Physical" },
                                                { label: "Administrative" },
                                                { label: "Technical" },
                                                { label: "Policy , Procedure and Documentation" }

                                            ]}

                                            target={hipaaTargetScore} />
                                        <MaturityLevelLegendHipaa />
                                    </div>
                                </div>

                                {/* Chart Row */}
                                <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
                                    {categoryWiseScore.length > 0 && (
                                        <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                            <MultiLineChart
                                                dataSets={[{ label: "Maturity score", data: categoryWiseScore },
                                                { label: "Target score", data: categoryWiseTargetScore }
                                                ]}
                                                title="Function-wise HIPAA score"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <RadarChartComponent
                                            dataSets={[{ name: "Maturity score", data: categoryWiseScore },
                                            { name: "Target score", data: categoryWiseTargetScore }
                                            ]}
                                            label="Function-wise HIPAA score"
                                            notation="Each axis shows a function's average score (Max: 5)"
                                        />
                                    </div>

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <CategorisedBarChart
                                            datasets={[
                                                {
                                                    name: "Maturity score",
                                                    color: "#22d3ee",
                                                    data: categoryWiseScore,
                                                },
                                                { name: "Target score", data: categoryWiseTargetScore, color: "orange" }
                                            ]}
                                            title="Function-Wise HIPAA score"
                                            note="Average score per function (range 0 to 5)"
                                            handleClick={handleBarClick}
                                        />
                                    </div>
                                </div>

                                {/* Table */}
                                <HipaaAnswerTable
                                    data={answersGiven}
                                    category={selectedCategoryName}
                                    target={hipaaTargetScore + 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TargetComparisonHipaa;
