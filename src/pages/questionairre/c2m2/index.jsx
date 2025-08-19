import { useEffect, useState, useCallback } from "react";
import { privateRequest } from "../../../api/config";
import QuestionCard from "./QuestionCard";
import SidebarInfo from "./SidebarInfo";
import { showToast } from "../../../lib/toast";

export default function C2m2Questionnaire() {
    const [domains, setDomains] = useState([]);
    const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [answers, setAnswers] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [marksResponse, setMarksResponse] = useState(null);

    const [evaluationId, setEvaluationId] = useState(null);

    const currentDomain = domains[currentDomainIndex];

    // Fetch available domains
    useEffect(() => {
        async function loadDomains() {
            try {
                const res = await privateRequest.get("/c2m2-questions/questions/domains");
                setDomains(res.data.domains || []);
            } catch (err) {
                console.error("Error fetching domains", err);
            }
        }
        loadDomains();
    }, []);

    useEffect(() => {
        if (!currentDomain) return;
        setLoading(true);
        async function loadQuestions() {
            try {
                const res = await privateRequest.get(`/c2m2-questions/${currentDomain}`);
                setQuestions(res.data.questions || []);
            } catch (err) {
                console.error("Error fetching questions", err);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        }
        loadQuestions();
    }, [currentDomain]);

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
                if (!evaluationId) {
                    setEvaluationId(res.data.data._id);
                }
                if (res.data.averageScore !== undefined) {
                    setMarksResponse(res.data.averageScore);
                } else if (res.data.data?.averageScore) {
                    setMarksResponse(res.data.data.averageScore);
                }
                if (submitting) showToast.success("Response recorded successfully.");
            }
        } catch (err) {
            console.error("Error saving evaluation:", err);
            if (submitting) showToast.error("Failed to submit responses");
        }
    }, [answers, evaluationId]);

    // Triggered whenever answer changes
    const handleAnswerChange = (questionId, answerData) => {
        setAnswers(prev => {
            const updated = { ...prev, [questionId]: answerData };
            return updated;
        });
    };

    const goToNextDomain = async () => {
        setSubmitLoading(true)
        await saveEvaluation(false);
        if (currentDomainIndex < domains.length - 1) {
            setCurrentDomainIndex(prev => prev + 1);
        }
        setSubmitLoading(false)
    };

    const goToPreviousDomain = async () => {
        setSubmitLoading(true)
        await saveEvaluation(false);
        if (currentDomainIndex > 0) {
            setCurrentDomainIndex(prev => prev - 1);
        }
        setSubmitLoading(false)
    };

    const handleFinalSubmit = async () => {
        setSubmitLoading(true);
        await saveEvaluation(true);
        setSubmitLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] text-white flex">
            <SidebarInfo
                current={currentDomain}
                index={currentDomainIndex}
                total={domains.length}
                onPrev={goToPreviousDomain}
                onNext={goToNextDomain}
                isSubmitted={isSubmitted}
                submitLoading={submitLoading}
                navigationLoading={submitLoading}
            />

            <div className="flex-1 p-6 md:p-10 overflow-auto">
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
                            onAutoSave={() => saveEvaluation(false)} // auto-save without marking submitted
                        />

                        {currentDomainIndex === domains.length - 1 && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={submitLoading}
                                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-800 transition-all"
                                >
                                    {submitLoading ? "Submitting..." : "Submit All Domains"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
