import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
    fill: modelColors[item.model] || '#94a3b8'
  }));

  // Create chart config for shadcn
  const chartConfig = data.reduce((acc, item) => {
    acc[item.model] = {
      label: item.model,
      color: modelColors[item.model] || '#94a3b8'
    };
    return acc;
  }, {
    label: {
      color: "hsl(var(--background))",
    },
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: 0,
            right: 80,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="model"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <XAxis
            dataKey="score"
            type="number"
            hide
            domain={[0, 100]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="score"
            layout="vertical"
            radius={6}
          >
            <LabelList
              dataKey="model"
              position="insideLeft"
              offset={12}
              className="fill-white font-medium"
              fontSize={14}
            />
            <LabelList
              dataKey="score"
              position="right"
              offset={12}
              className="fill-foreground font-bold"
              fontSize={16}
              formatter={(value) => `${value}%`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
