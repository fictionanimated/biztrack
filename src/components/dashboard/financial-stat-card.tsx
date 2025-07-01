
"use client";

import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface FinancialStatCardProps {
  title: string;
  value: string;
  dateRange: string;
  chartData: { value: number }[];
  chartType: "bar" | "line";
  gradient: string;
  className?: string;
}

const chartComponents = {
  bar: BarChart,
  line: LineChart,
};

export function FinancialStatCard({
  title,
  value,
  dateRange,
  chartData,
  chartType,
  gradient,
  className,
}: FinancialStatCardProps) {
  const Chart = chartComponents[chartType];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-4 text-white shadow",
        className
      )}
    >
      <div
        className={cn("absolute inset-0 bg-gradient-to-br", gradient)}
        aria-hidden="true"
      ></div>
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-white/80">{title}</h3>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="h-10 w-20 text-white/50">
            <ResponsiveContainer width="100%" height="100%">
              <Chart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                {chartType === "line" && (
                  <Line
                    type="natural"
                    dataKey="value"
                    stroke="currentColor"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {chartType === "bar" && (
                  <Bar dataKey="value" fill="currentColor" />
                )}
              </Chart>
            </ResponsiveContainer>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-white/80">{dateRange}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
