import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";

const CategorisedBarChart = ({ datasets, title, note, handleClick }) => {
  console.log("dtasets are ", datasets)
  // Merge all datasets by functionName
  const mergedData = [];

  datasets.forEach((dataset, datasetIndex) => {
    console.log("dataset is ", dataset)
    dataset.data.forEach((item) => {
      const existing = mergedData.find((d) => d.functionName === item.functionName);
      if (existing) {
        existing[`score${datasetIndex}`] = parseFloat(item.averageScore);
      } else {
        mergedData.push({
          functionName: item.functionName,
          [`score${datasetIndex}`]: parseFloat(item.averageScore),
        });
      }
    });
  });

  const handleBarClick = (data) => {
    if (data && data.functionName) {
      handleClick(data.functionName.toUpperCase());
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-md text-white w-full max-w-5xl h-[500px] border border-slate-500">
      <h2 className="text-center text-lg font-semibold mb-1">{title}</h2>
      {note && <p className="text-center text-sm text-slate-400 mb-4">{note}</p>}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={mergedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="functionName" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" domain={[0, 5]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
            itemStyle={{ color: "#93c5fd" }}
          />
          <Legend />
          {datasets.map((dataset, i) => (
            <Bar
              key={i}
              dataKey={`score${i}`}
              fill={dataset.color}
              onClick={handleBarClick}
              name={dataset.name}
            >
              <LabelList dataKey={`score${i}`} position="top" fill="#fff" />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategorisedBarChart;
