import { useState } from 'react'
import { initialQuestions } from '../../constants/initialQuestions'
import QuestionAnswer from './questionAnswer'
import { motion } from 'framer-motion'
import { publicRequest } from '../../api/config'
import { ClipLoader } from 'react-spinners'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export default function QuestionsFlow() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleAnswered = (answerObj) => {
        setAnswers((prev) => [...prev, answerObj])
        setCurrentIndex((prev) => prev + 1)
    }

    const isFinished = currentIndex >= initialQuestions.length
    const totalScore = answers.reduce((acc, ans) => acc + ans.mark, 0)
    const finalScore = parseFloat((totalScore / 7).toFixed(1))

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            await publicRequest.post('/maturity-results', { score: finalScore })
            setSubmitted(true)
        } catch (error) {
            console.error('Submission failed:', error)
            alert('Something went wrong while submitting your results.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
            {!isFinished ? (
                <>
                    <motion.div
                        className="text-sm text-gray-400 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        Question {currentIndex + 1} of {initialQuestions.length}
                    </motion.div>

                    <QuestionAnswer
                        key={initialQuestions[currentIndex].id}
                        question={initialQuestions[currentIndex]}
                        onAnswered={handleAnswered}
                    />
                </>
            ) : (
                <motion.div
                    className="text-center max-w-xl p-6 bg-slate-900 rounded-xl border border-white/10 shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2 className="text-3xl font-bold mb-4">Assessment Complete ✅</h2>
                    <p className="text-lg text-gray-300 mb-6">
                        Thank you for completing the cybersecurity maturity questionnaire.
                    </p>

                    {!submitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-700 mx-auto hover:bg-blue-800 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-3 min-w-[180px] mx-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <ClipLoader size={18} color="#ffffff" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                'Submit Results'
                            )}
                        </button>
                    ) : (
                        <>
                            <div className="text-xl text-sky-400 font-semibold mb-6 mt-4">
                                Your Score Range:{' '}
                                <span className="text-white">
                                    {finalScore < 1 && 'Between 0 to 1'}
                                    {finalScore >= 1 && finalScore < 2 && 'Between 1 to 2'}
                                    {finalScore >= 2 && finalScore < 2.5 && 'Between 2 to 2.5'}
                                    {finalScore >= 2.5 && finalScore <= 3 && 'Between 2.5 to 3'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center mt-6">
                                <Button
                                    onClick={() => {
                                        setAnswers([])
                                        setCurrentIndex(0)
                                        setSubmitted(false)
                                    }}
                                    variant="secondary"
                                >
                                    Retake Assessment
                                </Button>

                                <Button
                                    onClick={() => {
                                        navigate("/signup")
                                    }}
                                    variant="primary"
                                >
                                    Roadmap Analysis
                                </Button>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    )
}
