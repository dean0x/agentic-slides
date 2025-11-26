import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const modelColors = {
  'Claude Opus 4.5': '#CC785C',    // Anthropic brand orange/terracotta
  'Gemini 3 Pro': '#4285F4',       // Google blue
  'GPT-5.1': '#10A37F',            // OpenAI teal/green
  'Qwen3-Max': '#FF6A00',          // Alibaba orange
  'DeepSeek R1': '#0066FF',        // DeepSeek blue
  'Kimi K2': '#7C3AED'             // Moonshot purple
};

export const BenchmarkChart = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map(item => ({
    name: item.model,
    score: parseFloat(item.score),
    color: modelColors[item.model] || '#94a3b8'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full p-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 13 }}
            label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 14, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar
            dataKey="score"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
