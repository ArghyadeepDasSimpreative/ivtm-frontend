import { motion } from "framer-motion";

export default function SidebarInfo({
  current,
  index,
  total,
  onPrev,
  onNext,
  isSubmitted,
  submitLoading,
  navigationLoading
}) {
  return (
    <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 text-white">{current}</h2>
        <p className="text-gray-400 text-sm">
          This section contains questions related to the {current} domain.
        </p>
      </motion.div>

      {!isSubmitted && (
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={onPrev}
            disabled={index === 0 || navigationLoading}
            className={`px-4 py-2 rounded-xl text-sm w-[100px] ${
              index === 0 || navigationLoading
                ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-400 text-sm">
            Step {index + 1} of {total}
          </span>

          <button
            onClick={onNext}
            disabled={navigationLoading || index === total - 1}
            className={`px-4 py-2 rounded-xl text-sm w-[100px] ${
              navigationLoading
                ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
