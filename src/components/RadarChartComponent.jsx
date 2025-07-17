// components/RadarChartComponent.jsx
import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer
} from "recharts";

const RadarChartComponent = ({ data, maxScore = 5, label = "Function-wise Score", notation }) => {
  const chartData = data.map((item) => ({
    subject: item.functionName,
    score: parseFloat(item.averageScore),
    fullMark: maxScore,
  }));

  return (
    <div className="bg-slate-900 text-white p-4 rounded-md w-full max-w-3xl mx-auto">
      <h3 className="text-center text-lg font-semibold mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
          <PolarRadiusAxis angle={30} domain={[0, maxScore]} stroke="#64748b" />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      {notation && <p className="text-sm text-center mt-4 text-slate-400">{notation}</p>}
    </div>
  );
};

export default RadarChartComponent;
