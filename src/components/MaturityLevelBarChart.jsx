import { FaMapMarkerAlt, FaFlag } from "react-icons/fa";

const barColors = [
  "bg-blue-300",
  "bg-blue-400",
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800"
];

export default function MaturityLevelBarChart({ position = 0, target = null, levels = [] }) {
  const maxHeight = 400; // For consistent scaling if levels length changes
  const maxLevels = Math.max(levels.length, 1);

  return (
    <div className="w-full h-full flex flex-col items-center p-8 bg-slate-900 rounded-[20px] m-0">
      {/* Bars and markers */}
      <div className="flex items-end justify-center gap-4">
        {levels.map((level, index) => {
          console.log("index is ", index)
          const isPosition = position === index;
          const isTarget = target === index;
          const height = ((index + 1) / maxLevels) * maxHeight;
          const barWidth = 100;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative"
              style={{ width: `${barWidth}px` }}
            >
              {/* Target marker (green flag) */}
              {isTarget && (
                <FaFlag className="text-green-500 text-xl mb-1 absolute -top-7" />
              )}

              {/* Current position marker (red pointer) */}
              {isPosition && (
                <FaMapMarkerAlt className="text-red-500 text-3xl mb-2 z-10" />
              )}

              {/* Bar */}
              <div
                className={`w-full ${barColors[index] || "bg-blue-900"}`}
                style={{
                  height: `${height}px`,
                  borderRadius: "6px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels below bars */}
      <div className="flex justify-center mt-6 gap-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className="text-center px-1"
            style={{ width: "100px" }}
          >
            <div className="text-base text-gray-200 font-semibold">
              {level.label}
            </div>
            {level.subtitle && (
              <div className="text-sm text-gray-400">{level.subtitle}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
