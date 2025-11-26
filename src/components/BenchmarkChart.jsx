import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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
    model: item.model,
    score: parseFloat(item.score),
  }));

  // Create chart config for shadcn
  const chartConfig = data.reduce((acc, item) => {
    acc[item.model] = {
      label: item.model,
      color: modelColors[item.model] || '#94a3b8'
    };
    return acc;
  }, {});

  return (
    <div className="w-full h-full p-8">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="model"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 13 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Score (%)',
              angle: -90,
              position: 'insideLeft',
              fill: '#475569',
              fontSize: 14,
              fontWeight: 600
            }}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar
            dataKey="score"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
            fill="currentColor"
          >
            {chartData.map((entry, index) => (
              <rect
                key={`bar-${index}`}
                fill={modelColors[entry.model]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
