import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'

export default function QuestionAnswer({ question, onAnswered }) {
  const [selected, setSelected] = useState(null)
  const [subSelected, setSubSelected] = useState([])
  const [multiSelected, setMultiSelected] = useState([])

  const isObjective = question.type === 'objective'
  const isMulti = question.type === 'multi'

  const handleSelect = (value) => {
    if (isObjective) {
      setSelected(value)
    } else {
      setMultiSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    }
  }

  const handleSubSelect = (value) => {
    setSubSelected([value])
  }

  const calculateMark = () => {
    let mark = 0

    if (isObjective) {
      if (selected === 'No') mark = 1
      else if (selected === 'Yes' && question.subQuestion) {
        if (subSelected[0] === question.subQuestion.options[0]) mark = 2
        else mark = 3
      } else {
        mark = 3
      }
    } else if (isMulti) {
      mark = question.allSameMarks ? 3 : multiSelected.length
    }

    return mark
  }

  const handleSubmit = () => {
    const mark = calculateMark()

    const answerPayload = {
      questionId: question.id,
      answer: isObjective ? selected : multiSelected,
      subAnswer: subSelected,
      mark,
    }

    onAnswered(answerPayload)
    setSelected(null)
    setMultiSelected([])
    setSubSelected([])
  }

  return (
    <motion.div
      className="w-full max-w-3xl bg-slate-900 text-white p-6 rounded-2xl border border-white/10 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-lg font-semibold mb-4">{question.questionText}</div>

      <div className="grid gap-3 mb-6">
        {question.options.map((option, index) => {
          const isActive = isObjective
            ? selected === option
            : multiSelected.includes(option)

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`px-5 py-3 rounded-md border cursor-pointer border-white/10 text-left transition-all duration-300 ${
                isActive ? 'bg-blue-700/60 text-white' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {isActive && <FaCheckCircle className="text-green-400" />}
                {option}
              </div>
            </button>
          )
        })}
      </div>

      {/* SubQuestion Rendering */}
      {selected === 'Yes' && question.subQuestion && (
        <motion.div
          className="mt-4 bg-slate-800 p-4 rounded-xl border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-base font-medium mb-3">{question.subQuestion.questionText}</div>
          <div className="grid gap-3">
            {question.subQuestion.options.map((sub, idx) => {
              const active = subSelected.includes(sub)
              return (
                <button
                  key={idx}
                  onClick={() => handleSubSelect(sub)}
                  className={`px-4 py-2 rounded-md border border-white/10 text-left transition-all duration-300 ${
                    active ? 'bg-sky-700/60 text-white' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {active && <FaCheckCircle className="text-green-400" />}
                    {sub}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      <button
        disabled={
          (isObjective && !selected) ||
          (selected === 'Yes' && question.subQuestion && subSelected.length === 0) ||
          (isMulti && multiSelected.length === 0)
        }
        onClick={handleSubmit}
        className="mt-6 mx-auto bg-blue-700 hover:bg-blue-800 transition-all text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-40"
      >
        Confirm
      </button>
    </motion.div>
  )
}
