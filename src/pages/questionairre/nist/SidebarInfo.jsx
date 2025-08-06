import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { privateRequest } from "../../../api/config";
import TreeDisplay from "../../../components/TreeDisplay";
import { ClipLoader } from "react-spinners";

const descriptions = {
  Identify: "Helps understand the organizational environment to manage risk.",
  Protect: "Implements safeguards to ensure service delivery.",
  Detect: "Allows timely discovery of cybersecurity events.",
  Respond: "Outlines actions regarding detected events.",
  Recover: "Maintains resilience and plans restoration.",
  Govern: "Establishes oversight for cybersecurity (CSF 2.0).",
};

export default function SidebarInfo({ current, index, total, onPrev, onNext, onSubmit, isSubmitted, submitLoading }) {
  console.log("submit loaidng is ", submitLoading)
  const [loading, setLoading] = useState(true);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);

  async function fetchSubCategories() {
    try {
      const response = await privateRequest.get(`/nist-questions/subcategories?function=${current.toUpperCase()}`);
      setSubcategoryInfo(response.data);
    } catch (err) {
      console.log("err is ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubCategories();
  }, [current]);

  return (
    <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 animate-pulse">Loading subcategories...</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-white">{current}</h2>
            <p className="text-gray-400 text-sm">{descriptions[current]}</p>
          </motion.div>

          {!isSubmitted ? (
            <TreeDisplay data={subcategoryInfo} />
          ) : (
            <div className="mt-6 bg-green-800/20 p-4 rounded-lg text-green-300 text-sm">
              <p>✅ Questionnaire completed !</p>
              <p className="mt-1">You can now review or export the results.</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={onPrev}
              disabled={index === 0}
              className={`px-4 py-2 rounded-xl text-sm ${
                index === 0
                  ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                  : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-400 text-sm">
              Step {index + 1} of {total}
            </span>

            {index === total - 1 ? (
              <button
                onClick={()=>onSubmit(true)}
                className="px-4 py-2 rounded-xl text-sm bg-green-700 hover:bg-green-800 text-white"
              >
                {submitLoading? <ClipLoader size={18} color="#ffffff" /> :  "Submit"}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-xl text-sm bg-blue-700 hover:bg-blue-800 text-white"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
