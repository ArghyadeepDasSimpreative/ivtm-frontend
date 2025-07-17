import { FaMapMarkerAlt } from "react-icons/fa";

const levels = [
  { label: "Adhoc" },
  { label: "Define" },
  { label: "Manage" },
  { label: "Proactive detection" },
  { label: "Optimised" },
];

const barColors = [
  "bg-blue-300",
  "bg-blue-400",
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-700",
];

export default function MaturityLevelBarChart({ position = 0 }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Bars and markers */}
      <div className="flex items-end justify-center gap-0">
        {levels.map((_, index) => {
          const isActive = position === index;
          const height = (index + 1) * 48; // bar height scaling
          const barWidth = 80; // updated width

          return (
            <div key={index} className="flex flex-col items-center" style={{ width: `${barWidth}px` }}>
              {isActive && (
                <FaMapMarkerAlt className="text-red-500 text-xl mb-1" />
              )}
              <div
                className={`w-full ${barColors[index]}`}
                style={{
                  height: `${height}px`,
                  borderRadius: "0px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels below bars */}
      <div className="flex justify-center mt-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className="text-center px-1"
            style={{ width: "80px" }}
          >
            <div className="text-sm text-gray-300 font-medium">{level.label}</div>
            {level.subtitle && (
              <div className="text-sm text-gray-400">{level.subtitle}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
