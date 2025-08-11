import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer
} from "recharts";

const colors = [
  "#38bdf8", // sky-400
  "#f97316", // green-400
  "#facc15", // yellow-400
  "#f472b6", // pink-400
  "#a78bfa", // purple-400
];

const RadarChartComponent = ({ dataSets = [], maxScore = 5, label = "Function-wise Score", notation }) => {
  console.log("radar datasets ", dataSets)
  // Prepare merged data for all sets
  const mergedData = [];
  const allSubjects = new Set();

  // Collect all unique function names (subjects)
  dataSets.forEach(set => {
    set.data.forEach(item => allSubjects.add(item.functionName));
  });

  // Create data object per subject
  allSubjects.forEach(subject => {
    const obj = { subject };
    dataSets.forEach(set => {
      const found = set.data.find(item => item.functionName === subject);
      obj[set.name] = found ? parseFloat(found.averageScore) : 0;
    });
    mergedData.push(obj);
  });

  return (
    <div className="bg-slate-900 text-white p-4 rounded-md w-full max-w-3xl h-[500px]">
      <h3 className="text-center text-lg font-semibold mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mergedData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
          <PolarRadiusAxis angle={30} domain={[0, maxScore]} stroke="#64748b" />
          {dataSets.map((set, index) => (
            <Radar
              key={set.name}
              name={set.name}
              dataKey={set.name}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.4}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      {notation && <p className="text-sm text-center mt-4 text-slate-400">{notation}</p>}
    </div>
  );
};

export default RadarChartComponent;
