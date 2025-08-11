import { FaMapMarkerAlt, FaFlag } from "react-icons/fa";

const barColors = [
  "bg-blue-300",
  "bg-blue-400",
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800"
];

export default function MaturityLadder({ position = 0, target = null, levels = [] }) {
  const maxHeight = 250; // Slightly reduced from 400
  const maxLevels = Math.max(levels.length, 1);

  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-slate-900 rounded-[16px] m-0 py-10">
      {/* Bars and markers */}
      <div className="flex items-end justify-center gap-3">
        {levels.map((level, index) => {
          const isPosition = position === index;
          const isTarget = target === index;
          const height = ((index + 1) / maxLevels) * maxHeight;
          const barWidth = 60; // Reduced slightly from 100

          return (
            <div
              key={index}
              className="flex flex-col items-center relative"
              style={{ width: `${barWidth}px` }}
            >
              {/* Target marker (green flag) */}
              {isTarget && (
                <FaFlag className="text-green-500 text-md absolute -top-6" />
              )}

              {/* Current position marker (red pointer) */}
              {isPosition && (
                <FaMapMarkerAlt className="text-red-500 text-xl mb-1 z-10" />
              )}

              {/* Bar */}
              <div
                className={`w-full ${barColors[index] || "bg-blue-900"}`}
                style={{
                  height: `${height}px`,
                  borderRadius: "5px",
                }}
              />
            </div>
          );
        })}
      </div>
      <p className="text-white mt-5 mb-0 text-lg font-semibold">Maturity Ladder</p>
    </div>
  );
}
