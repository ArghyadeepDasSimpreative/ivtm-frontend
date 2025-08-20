import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { privateRequest } from "../../../api/config";
import QuestionCard from "./QuestionCard";
import SidebarInfo from "./SidebarInfo";
import QuestionPagination from "../../../components/QuestionPagination";
import Button from "../../../components/Button";
import { showToast } from "../../../lib/toast";

export default function C2m2Questionnaire() {
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const navigate = useNavigate();
    const evaluationId = query.get("evaluation-id");

    const [domains, setDomains] = useState([]);
    const [currentDomainIndex, setCurrentDomainIndex] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [marksResponse, setMarksResponse] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [questionNavigationLoading, setQuestionNavigationLoading] = useState(false)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const currentDomain = domains[currentDomainIndex];

    console.log("from parent questionLaoding is ", questionNavigationLoading)

    useEffect(() => {
        async function loadData() {
            try {
                // First API call to get domains
                const resDomains = await privateRequest.get("/c2m2-questions/questions/domains");
                setDomains(resDomains.data.domains || []);

                // Second API call to check draft exists
                const resDraft = await privateRequest.get("/c2m2-evaluations/assessments/draft-exists");
                if (resDraft.data.status === true && !evaluationId) {
                    showToast.info("You have an existing draft assessment. Please complete it before starting a new one.");
                    navigate('/roadmap-analysis'); // Assuming you have useNavigate hook
                }
            } catch (err) {
                console.error("Error fetching data", err);
                showToast.error("Error loading data");
            }
        }

        loadData();
    }, []);

    // On domain change, load questions and prefill answers if eval id
    useEffect(() => {
        if (!currentDomain) return;
        setLoading(true);
        setCurrentQuestionIndex(0);
        async function fetchData() {
            try {
                const res = await privateRequest.get(`/c2m2-questions/${currentDomain}`);
                const fetchedQuestions = res.data.questions || [];
                setQuestions(fetchedQuestions);
                // If evaluationId present, fetch previous answers and set default answers
                if (evaluationId) {
                    const ansRes = await privateRequest.get(`/c2m2-evaluations/average/${evaluationId}`);
                    const prevAnswers = ansRes.data.data || [];
                    const ansMap = {};
                    prevAnswers.forEach(a => {
                        ansMap[a.questionId] = {
                            primary: a.answer,
                            followUp: a.followUp || "",
                            marks: a.marks || 0,
                            domain: a.domain
                        };
                    });
                    // Merge with current questions (won't override unless present)
                    setAnswers((prev) => {
                        const merged = { ...prev };
                        fetchedQuestions.forEach(q => {
                            if (ansMap[q._id]) merged[q._id] = ansMap[q._id];
                        });
                        return merged;
                    });
                }
            } catch (err) {
                setQuestions([]);
                console.error("Error fetching questions or answers", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [currentDomain, evaluationId]);

    const saveEvaluation = useCallback(async (submitting = false) => {
        if (Object.keys(answers).length === 0) return;
        const transformedAnswers = Object.entries(answers).map(([questionId, data]) => ({
            questionId,
            ...data
        }));
        const payload = { answers: transformedAnswers, status: submitting };
        try {
            let res;
            if (evaluationId) {
                res = await privateRequest.put(`/c2m2-evaluations/${evaluationId}`, payload);
            } else {
                res = await privateRequest.post(`/c2m2-evaluations`, payload);
            }
            if (res.status === 200) {
                // Only store returned _id if missing before
                if (!evaluationId && res.data.data?._id) {
                    query.set("evaluation-id", res.data.data._id);
                    navigate({ search: query.toString() }, { replace: true });
                }

                if (res.data.averageScore !== undefined) {
                    setMarksResponse(res.data.averageScore);
                } else if (res.data.data?.averageScore) {
                    setMarksResponse(res.data.data.averageScore);
                }
                if (submitting) showToast.success("Response recorded successfully.");
            }
        } catch (err) {
            if (submitting) showToast.error("Failed to submit responses");
            console.error("Error saving evaluation:", err);
        }
        
    }, [answers, evaluationId, query]);


    const handleAnswerChange = (questionId, answerData) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerData
        }));
    };

    const goToNextDomain = async () => {
        setSubmitLoading(true);
        await saveEvaluation(false);
        setCurrentDomainIndex(prev => prev + 1);
        setSubmitLoading(false);
    };

    const goToPreviousDomain = async () => {
        setSubmitLoading(true);
        await saveEvaluation(false);
        setCurrentDomainIndex(prev => prev - 1);
        setSubmitLoading(false);
    };

    const goToQuestion = async (targetIndex) => {
        setSubmitLoading(true);
        setQuestionNavigationLoading(true);
        await saveEvaluation(false);
        setCurrentQuestionIndex(targetIndex);
        setQuestionNavigationLoading(false);
        setSubmitLoading(false);
    };

    const handleFinalSubmit = async () => {
        setSubmitLoading(true);
        await saveEvaluation(true);
        setIsSubmitted(true);
        setSubmitLoading(false);
    };

    const selectDomain = async (targetIndex) => {
        setSubmitLoading(true);
        await saveEvaluation(false);
        setCurrentDomainIndex(targetIndex);
        setSubmitLoading(false);
    };


    return (
        <div className="min-h-screen w-full bg-[#0f172a] text-white flex">
            <SidebarInfo
                current={currentDomain}
                index={currentDomainIndex}
                total={domains.length}
                onPrev={currentDomainIndex > 0 ? goToPreviousDomain : undefined}
                onNext={currentDomainIndex < domains.length - 1 ? goToNextDomain : undefined}
                onSelectDomain={selectDomain}
                isSubmitted={isSubmitted}
                submitLoading={submitLoading}
                navigationLoading={submitLoading}
                Button={Button}
            />

            <div className="flex-1 flex flex-col justify-between p-6 md:p-10 overflow-auto">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 animate-pulse">Loading questions...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                        <p className="text-red-400 text-md">
                            No questions found for <span className="font-bold">{currentDomain}</span>
                        </p>
                    </div>
                ) : isSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="bg-green-800/10 p-6 rounded-lg max-w-md">
                            <h2 className="text-xl font-bold text-green-400 mb-2">Submitted!</h2>
                            <p className="text-gray-300 mb-4">Your responses have been recorded.</p>
                            {marksResponse !== null && (
                                <p className="text-blue-400 text-md mt-1">Average Score: {marksResponse}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <QuestionCard
                            questions={questions}
                            domain={currentDomain}
                            answersParent={answers}
                            onAnswerChange={handleAnswerChange}
                            onAutoSave={() => saveEvaluation(false)}
                            currentQuestionIndex={currentQuestionIndex}
                            setCurrentQuestionIndex={setCurrentQuestionIndex}
                            Button={Button}
                            submitLoading={submitLoading}
                            pageLoading={questionNavigationLoading}
                            setPageLoading={(param)=>
                            {
                                console.log("guyana");
                                 setQuestionNavigationLoading(param)
                            }
                               }
                        />
                        <div className="rounded-lg border border-blue-500 bg-slate-900 px-6 py-4 shadow-md w-[80%] mx-auto mt-10">
                            {/* <h2 className="text-blue-400 font-semibold text-md mb-1">
          Default Option Notice
        </h2> */}
                            <p className="text-slate-100 text-sm">
                                If nothing is selected, all questions of this section will have a default option selected.
                            </p>
                        </div>
                        <QuestionPagination
                            questions={questions}
                            currentIndex={currentQuestionIndex}
                            onSelect={goToQuestion}
                            loading={submitLoading || questionNavigationLoading}
                        />
                        {currentDomainIndex === domains.length - 1 && currentQuestionIndex === questions.length - 1 && (
                            <div className="mt-10 text-center">
                                <Button
                                    variant="primary"
                                    onClick={handleFinalSubmit}
                                    disabled={submitLoading}
                                    loading={submitLoading}
                                >
                                    Submit All Domains
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
