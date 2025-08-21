import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { privateRequest } from "../../../api/config";

import CustomSelect from "../../../components/Select";
import MaturityLadder from "../../../components/MaturityLadder";
import RadarChartComponent from "../../../components/RadarChartComponent";
import CategorisedBarChart from "../../../components/CategorisedBarChart";
import MultiLineChart from "../../../components/MultiLineChart";
import MaturityLevelLegendC2m2 from "../../../components/MaturityLegendC2m2";
import { showToast } from "../../../lib/toast";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Button from "../../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { BiGitCompare } from "react-icons/bi";
import { IoDownloadOutline } from "react-icons/io5";
import C2m2AnswerTable from "../../../components/C2m2AnswerTable";

const C2m2AnalysisPreview = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const evaluationIdFromUrl = queryParams.get("evaluation-id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [selectedId, setSelectedId] = useState(evaluationIdFromUrl);
  const [evaluationStats, setEvaluationStats] = useState(null);
  const [domainWiseData, setDomainWiseData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [totalAnswers, setTotalAnswers] = useState([]);
  const [tempTotalAnswers, setTempTotalAnswers] = useState([]);
  const exportRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await privateRequest.get("/c2m2-evaluations/assessments");
        if (response.status === 200) {
          const formatted = response.data.data.map(item => ({
            ...item,
            formattedDate: format(new Date(item.evaluationTime), "dd MMM yyyy, hh:mm a"),
            value: item._id
          }));
          setAssessmentsList(formatted);

          if (selectedId) {
            handleAssessmentChange({ value: selectedId });
          }
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


  function handleBarClick(domain) {
    showToast.success(`Showing data for domain ${domain}`);
    setTempTotalAnswers(totalAnswers.filter(answer=>answer.domain.toLowerCase() == domain.toLowerCase()))
  }


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
      pdf.save("c2m2_evaluation_report.pdf");

      showToast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      showToast.error("PDF download failed!");
    } finally {
      document.body.classList.remove("exporting");
    }
  };


  const handleAssessmentChange = async (option) => {
    const id = option?.value;
    setSelectedId(id);
    setEvaluationStats(null);
    setDomainWiseData([]);
    setSelectedDomain("");

    if (!id) return;

    try {
      // Get questions + answers
      const res = await privateRequest.get(`/c2m2-evaluations/average/${id}`);
      if (res.status === 200) {
        const questionsWithAnswers = res.data.data || [];
        setTotalAnswers(questionsWithAnswers);
        setTempTotalAnswers(questionsWithAnswers);

        // Example average calc
        const totalMarks = questionsWithAnswers.reduce((sum, q) => sum + (q.marks || 0), 0);
        const average = (questionsWithAnswers.length > 0
          ? (totalMarks / questionsWithAnswers.length).toFixed(2)
          : "0.00");

        setEvaluationStats({
          evaluationId: id,
          average
        });

        // Map into domain-wise structure
        const domainMap = {};
        questionsWithAnswers.forEach(q => {
          if (!domainMap[q.domain]) domainMap[q.domain] = [];
          domainMap[q.domain].push(q);
        });

        const domainData = Object.entries(domainMap).map(([domain, qs]) => {
          const total = qs.reduce((sum, q) => sum + (q.marks || 0), 0);
          return {
            functionName: domain,
            averageScore: parseFloat((total / qs.length).toFixed(2))
          };
        });

        setDomainWiseData(domainData);
      }
    } catch (err) {
      console.error(err);
      setEvaluationStats(null);
      setDomainWiseData([]);
      setSelectedDomain("");
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
          <p className="w-full text-center text-2xl font-semibold text-blue-200">
            Assessment result based on <strong className="text-blue-400">C2M2</strong>
          </p>

          <div className="flex justify-between items-end px-4">
            <CustomSelect
              label="Select Assessment"
              data={assessmentsList}
              config={{ key: "_id", label: "formattedDate" }}
              onSelect={handleAssessmentChange}
              width="300px"
            />
            {evaluationStats && (
              <div className="flex gap-3 items-center">
                <Button onClick={() => navigate("/roadmap-analysis/target-maturity/c2m2")}>
                  <BiGitCompare size={22} />
                  <span>Compare</span>
                </Button>
                <Button onClick={handleDownloadPdf}>
                  <IoDownloadOutline size={22} />
                  <span>Download PDF</span>
                </Button>
              </div>
            )}
          </div>

          {evaluationStats && (
            <div className="flex flex-col gap-10 mt-7 p-3">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="bg-slate-900 border border-blue-400 rounded-md w-[300px] h-[130px] flex flex-col justify-center items-center shadow-lg shadow-blue-700/30">
                  <h2 className="text-lg font-semibold text-blue-300">Overall Score</h2>
                  <p className="text-4xl font-bold mt-4 text-blue-100">{evaluationStats.average}</p>
                </div>

                <div className="flex gap-10 justify-end items-start">
                  <MaturityLadder
                    position={parseInt(evaluationStats.average)}
                    levels={[
                      { label: "Physical" },
                      { label: "Administrative" },
                      { label: "Technical" }
                    ]}
                  />
                  <MaturityLevelLegendC2m2 />
                </div>
              </div>

              {/* Charts */}
              <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
                {domainWiseData?.length > 0 && (
                  <div className="flex-1 bg-slate-900 p-4 rounded-md">
                    <MultiLineChart dataSets={[{ label: "Score", data: domainWiseData }]} />
                  </div>
                )}

                <div className="flex-1 bg-slate-900 p-4 rounded-md">
                  <RadarChartComponent
                    dataSets={[{ name: "Score", data: domainWiseData }]}
                    label="Domain-wise Maturity Radar"
                    maxScore={3}
                  />
                </div>

                <div className="flex-1 bg-slate-900 p-4 rounded-md">
                  <CategorisedBarChart
                    datasets={[{ name: "Score", data: domainWiseData, color: "#22d3ee" }]}
                    title="Domain-Wise Scores"
                    note="Average scores per domain (0 to 5)"
                    handleClick={handleBarClick}
                    maxscore={3}
                  />
                </div>
              </div>

              <C2m2AnswerTable answers={tempTotalAnswers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default C2m2AnalysisPreview;
