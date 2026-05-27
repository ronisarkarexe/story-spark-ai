"use client";
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const ComplexityGraph = ({
  bestCase = null,
  averageCase = null,
  worstCase = null,
  maxN = 100,
  title = "Time Complexity Analysis"
}) => {
  // Generate data points with smoother curve for better visualization
  const data = [];
  for (let n = 1; n <= maxN; n++) {
    data.push({
      n,
      best: bestCase ? bestCase(n) : null,
      average: averageCase ? averageCase(n) : null,
      worst: worstCase ? worstCase(n) : null
    });
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-gray-100">n = {label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-[400px] my-1 p-2 bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-center text-2xl font-black mb-1 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
        {title}
      </h2>
      
      <ResponsiveContainer width="100%" height="70%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            strokeOpacity={0.2}
            vertical={false}
          />
          
          <XAxis 
            dataKey="n"
            axisLine={{ stroke: '#6b7280', strokeWidth: 0.5 }}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            label={{
              value: "Input Size (n)",
              position: "insideBottomRight",
              offset: -10,
              fill: '#6b7280',
              fontSize: 12
            }}
          />
          
          <YAxis 
            axisLine={{ stroke: '#6b7280', strokeWidth: 0.5 }}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            label={{
              value: "Operations",
              angle: -90,
              position: "insideLeft",
              fill: '#6b7280',
              fontSize: 12,
              dy: 40
            }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              stroke: '#9ca3af',
              strokeWidth: 1,
              strokeDasharray: "3 3"
            }}
          />
          
          <ReferenceLine 
            y={0} 
            stroke="#9ca3af" 
            strokeWidth={0.5} 
            strokeOpacity={0.5} 
          />
          
          {bestCase && (
            <Line
              type="monotoneX"
              dataKey="best"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "#10b981"
              }}
              name="Best Case"
              animationDuration={1800}
              animationEasing="ease-out"
            />
          )}
          
          {averageCase && (
            <Line
              type="monotoneX"
              dataKey="average"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "#3b82f6"
              }}
              name="Average Case"
              animationDuration={1800}
              animationEasing="ease-out"
              animationBegin={300}
            />
          )}
          
          {worstCase && (
            <Line
              type="monotoneX"
              dataKey="worst"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "#ef4444"
              }}
              name="Worst Case"
              animationDuration={1800}
              animationEasing="ease-out"
              animationBegin={600}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <Legend content={renderLegend} />
    </div>
  );
};

export default ComplexityGraph;