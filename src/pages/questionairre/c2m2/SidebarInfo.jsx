import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoStatsChart } from "react-icons/io5";

export default function SidebarInfo({
  current,
  index,
  total,
  onPrev,
  onNext,
  onSelectDomain,
  isSubmitted,
  submitLoading,
  navigationLoading,
  Button,
}) {
  return (
    <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2 text-white">{current}</h2>
        <p className="text-gray-400 text-sm">
          This section contains questions related to the {current} domain.
        </p>
      </motion.div>

      {isSubmitted ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-green-400 font-semibold text-lg">
            Thank you for taking this assessment!
          </p>
          <p className="text-emerald-700 mb-4 text-sm">Your assessment reaasult is ready to be viewed</p>
          <Link to="/roadmap-analysis/analysis-preview/c2m2" className="w-full max-w-xs">
            <Button type="button">
              <IoStatsChart size={20} />
              View Analysis
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mt-10">
            <Button
              variant="secondary"
              onClick={onPrev}
              disabled={index === 0 || navigationLoading}
              loading={navigationLoading}
              size="xs"
            >
              Previous
            </Button>
            <span className="text-gray-400 text-sm">
              Step {index + 1} of {total}
            </span>
            <Button
              variant="primary"
              onClick={onNext}
              disabled={navigationLoading || index === total - 1}
              loading={navigationLoading}
              size="xs"
            >
              Next
            </Button>
          </div>

          {/* Domain pagination buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                disabled={navigationLoading || submitLoading || idx === index}
                onClick={async () => {
                  if (idx === index) return;
                  await onSelectDomain(idx);
                }}
                className={`w-8 h-8 rounded-full border text-sm ${
                  idx === index
                    ? "bg-blue-800 text-white border-blue-400"
                    : "bg-slate-700 text-gray-300 border-slate-500 hover:bg-blue-900"
                } ${navigationLoading || submitLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
