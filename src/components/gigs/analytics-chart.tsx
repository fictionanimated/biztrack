"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart";

interface AnalyticsData {
  date: string;
  impressions: number;
  clicks: number;
  messages: number;
  orders: number;
}

interface GigAnalyticsChartProps {
  data: AnalyticsData[];
  activeMetrics: Record<string, boolean>;
}

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "hsl(var(--chart-1))",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-2))",
  },
  messages: {
    label: "Messages",
    color: "hsl(var(--chart-3))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function GigAnalyticsChart({ data, activeMetrics }: GigAnalyticsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {activeMetrics.impressions && (
            <Line
            dataKey="impressions"
            type="natural"
            stroke="var(--color-impressions)"
            strokeWidth={2}
            dot={false}
            />
        )}
        {activeMetrics.clicks && (
            <Line
            dataKey="clicks"
            type="natural"
            stroke="var(--color-clicks)"
            strokeWidth={2}
            dot={false}
            />
        )}
        {activeMetrics.messages && (
            <Line
            dataKey="messages"
            type="natural"
            stroke="var(--color-messages)"
            strokeWidth={2}
            dot={false}
            />
        )}
        {activeMetrics.orders && (
            <Line
            dataKey="orders"
            type="natural"
            stroke="var(--color-orders)"
            strokeWidth={2}
            dot={false}
            />
        )}
      </LineChart>
    </ChartContainer>
  );
}
