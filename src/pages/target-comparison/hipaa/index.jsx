import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../../api/config";

import CustomSelect from "../../../components/Select";
import MaturityLadder from "../../../components/MaturityLadder";
import RadarChartComponent from "../../../components/RadarChartComponent";
import CategorisedBarChart from "../../../components/CategorisedBarChart";
import MultiLineChart from "../../../components/MultiLineChart";
import { showToast } from "../../../lib/toast";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Button from "../../../components/Button";
import HipaaAnswerTable from "../../../components/HipaaAnswerTable";
import { useTargetMaturity } from "../../../context/TargetMaturityContext";
import MaturityLevelLegendHipaa from "../../../components/MaturityLevelLegendHipaa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoDownloadOutline } from "react-icons/io5";

const TargetComparisonHipaa = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const evaluationIdFromUrl = queryParams.get("evaluation-id");
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assessmentsList, setAssessmentsList] = useState([]);
    const [selectedId, setSelectedId] = useState(evaluationIdFromUrl);
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [categoryWiseScore, setCategoryWiseScore] = useState([]);
    const [categoryWiseTargetScore, setCategoryWiseTargetScore] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [answersGiven, setAnswersGiven] = useState([]);
    const [defaultAssessment, setDefaultAssessment] = useState(null)

    const navigate = useNavigate()

    const exportRef = useRef();

    const {
        hipaaTargetScore
    } = useTargetMaturity();

    useEffect(function () {

        if (!hipaaTargetScore) {
            showToast.info("Please select you target maturity level first.")
            navigate("/roadmap-analysis/target-maturity/hipaa")
        }
    }, [])

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await privateRequest.get("/hipaa-evaluations/assessments");
                if (response.status === 200) {
                    const formatted = response.data.data.map((item) => ({
                        ...item,
                        formattedDate: format(new Date(item.timeTaken), "dd MMM yyyy, hh:mm a"),
                        value: item._id,
                    }));
                    setAssessmentsList(formatted);

                    if (selectedId) {
                        let defAssessment = formatted.find(assessment => assessment.value == selectedId);
                         setDefaultAssessment({value:defAssessment.value, label:defAssessment.formattedDate});
                        handleAssessmentChange({ value: selectedId });
                    }
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
                const data = res.data

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
            console.log(err)
            setEvaluationStats(null);
            setCategoryWiseScore([]);
            //   setMaturityDistribution([]);
            showToast.error("Failed to load evaluation details.");
        }
    };

    const handleDownloadPdf = async () => {
        try {
            document.body.classList.add("exporting");
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
        } finally {
            document.body.classList.remove("exporting");
        }
    };

    return (
        <div className="bg-[#0f172a] min-h-screen text-white p-8">
            {loading ? (
                <p className="text-blue-300 text-md">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col gap-10" ref={exportRef}>
                    <p className="w-full text-center text-2xl font-semibold text-blue-200">Assessment result based on <strong className="text-blue-400">HIPAA</strong> compliance</p>

                    <div className="flex justify-between items-end px-4">
                        <CustomSelect
                            label="Select HIPAA Assessment"
                            data={assessmentsList}
                            config={{ key: "_id", label: "formattedDate" }}
                            onSelect={handleAssessmentChange}
                            width="300px"
                            defaultValue={defaultAssessment}
                        />
                        {evaluationStats && (<div className="flex justify-between gap-3 items-center">
                            <Button variant="secondary" onClick={() => navigate("/roadmap-analysis")}>Back to Home</Button>
                            <Button onClick={handleDownloadPdf}>
                                <IoDownloadOutline size={22} />
                                Download PDF</Button>

                        </div>
                        )}
                    </div>

                    <div>
                        {evaluationStats && (
                            <div className="flex flex-col gap-10 mt-7 p-3">

                                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">

                                    <div className="flex flex-col justify-between items-center w-auto gap-10">
                                        <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                                            <h2 className="text-lg font-semibold text-blue-300">Overall Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                                        </div>
                                        <div className="bg-slate-900 border border-orange-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-orange-700/30">
                                            <h2 className="text-lg font-semibold text-blue-300">Target Score</h2>
                                            <p className="text-4xl font-bold mt-4 text-orange-300">{hipaaTargetScore + 1}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-10 justify-end items-start">
                                        <MaturityLadder position={parseInt(evaluationStats.average)}
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

                                <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
                                    {categoryWiseScore.length > 0 && (
                                        <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                            <MultiLineChart
                                                dataSets={[{ label: "Score", data: categoryWiseScore },
                                                { label: "Target", data: categoryWiseTargetScore }
                                                ]}
                                                title="Function-wise analysis"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <RadarChartComponent
                                            dataSets={[{ name: "Score", data: categoryWiseScore },
                                            { name: "Target", data: categoryWiseTargetScore }
                                            ]}
                                            label="Domain wise distribution"
                                        // notation="Each axis shows a function's average score (Max: 5)"
                                        />
                                    </div>

                                    <div className="flex-1 bg-slate-900 p-4 rounded-md">
                                        <CategorisedBarChart
                                            datasets={[
                                                {
                                                    name: "Score",
                                                    color: "#22d3ee",
                                                    data: categoryWiseScore,
                                                },
                                                { name: "Target", data: categoryWiseTargetScore, color: "orange" }
                                            ]}
                                            title="Number of elements wise analysis"
                                            note="Average score per function (range 0 to 5)"
                                            handleClick={handleBarClick}
                                        />
                                    </div>
                                </div>

                                <HipaaAnswerTable
                                    data={answersGiven}
                                    category={selectedCategoryName}
                                    target={hipaaTargetScore}
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
