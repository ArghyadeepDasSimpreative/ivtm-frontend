// QuestionPagination.js
export default function QuestionPagination({ questions, currentIndex, onSelect, loading }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8">
      {questions.map((_, idx) => (
        <button
          key={idx}
          disabled={loading}
          className={`w-8 h-8 rounded-full border text-sm cursor-pointer
            ${currentIndex === idx
                ? "bg-blue-800 text-white border-blue-400"
                : "bg-slate-700 text-gray-300 border-slate-500 hover:bg-blue-900"
            } 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => onSelect(idx)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  )
}
