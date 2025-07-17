import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell
} from "recharts";

const blueShades = [
  "#3b82f6", // blue-500
  "#2563eb", // blue-600
  "#1d4ed8", // blue-700
  "#1e40af", // blue-800
  "#1e3a8a", // blue-900
  "#60a5fa", // blue-400
];

const FunctionWiseBarChart = ({ data }) => {
  const parsedData = data.map((item, idx) => ({
    ...item,
    averageScore: parseFloat(item.averageScore),
    fill: blueShades[idx % blueShades.length],
  }));

  return (
    <div className="bg-slate-900 p-4 rounded-md shadow-md text-white w-full max-w-3xl mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">Function-wise Scores</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={parsedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="functionName" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" domain={[0, 5]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
            itemStyle={{ color: "#93c5fd" }}
          />
          <Bar dataKey="averageScore">
            <LabelList dataKey="averageScore" position="top" fill="#fff" />
            {parsedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunctionWiseBarChart;
