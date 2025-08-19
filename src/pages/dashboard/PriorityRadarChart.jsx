import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const PriorityRadarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[40vh] shadow-md border border-zinc-200 rounded flex items-center justify-center text-gray-500">
                No data available to display.
            </div>
        );
    }

    const priorityCount = data.reduce((acc, item) => {
        const priority =
            item.priority?.charAt(0).toUpperCase() +
            item.priority?.slice(1).toLowerCase();
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {});

    const chartData = ["Critical", "High", "Medium", "Low"].map((priority) => ({
        priority,
        count: priorityCount[priority] || 0,
    }));

    return (
        <div className="w-full h-[55vh] shadow-md border border-zinc-200 rounded-xl p-4 bg-white">
            <h2 className="text-md font-semibold mb-4 text-gray-800">Priority Wise Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={120} data={chartData}>
                    <PolarGrid stroke="#e2e8f0" /> {/* Light grid lines */}
                    <PolarAngleAxis
                        dataKey="priority"
                        stroke="#475569" // Blue-gray text
                        tick={{ fontSize: 14, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, Math.max(...chartData.map((d) => d.count)) || 1]}
                        stroke="#94a3b8" // Muted cyan
                        tick={{ fill: "#64748b" }} // Slightly lighter than axis
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "none",
                            color: "#f1f5f9",
                            borderRadius: "8px",
                            fontSize: "14px",
                        }}
                        cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
                    />
                    <Radar
                        name="Vulnerabilities"
                        dataKey="count"
                        stroke="#0ea5e9" // Sky blue stroke
                        fill="#0ea5e9"
                        fillOpacity={0.5}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriorityRadarChart;
