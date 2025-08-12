import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const lineColors = ['#3b82f6', '#f97316']; // Blue and Orange

const MultiLineChart = ({ dataSets, title = "Function-wise Score Trend" }) => {
  
  if (!Array.isArray(dataSets) || dataSets.length === 0) {
    return <div>No data available</div>;
  }

  const labels = dataSets[0].data.map(item => item.functionName);

  const chartData = labels.map(label => {
    const row = { functionName: label };
    dataSets.forEach((set) => {
      const match = set.data.find(d => d.functionName === label);
      row[set.label] = parseFloat(match?.averageScore || 0);
    });
    return row;
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        padding: '16px'
      }}
      className='border border-slate-500'
    >
      <h3 style={{ marginBottom: '20px', color: '#f1f5f9', fontSize: '18px', fontWeight: '600' }}>
        {title}
      </h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#475569" strokeDasharray="3 3" />
            <XAxis dataKey="functionName" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
            <Legend />
            {dataSets.map((set, index) => (
              <Line
                key={set.label}
                type="monotone"
                dataKey={set.label}
                stroke={lineColors[index % 2]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiLineChart;
