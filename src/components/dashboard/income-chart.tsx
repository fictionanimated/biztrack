"use client";

import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { type IncomeBySource } from "@/lib/placeholder-data";

interface IncomeChartProps {
  data: IncomeBySource[];
}

export default function IncomeChart({ data }: IncomeChartProps) {
  const totalIncome = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);

  const chartConfig = useMemo(() => {
    const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ];
    return data.reduce((acc, { source }, index) => {
      acc[source] = {
        label: source,
        color: colors[index % colors.length],
      };
      return acc;
    }, {} as ChartConfig);
  }, [data]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              nameKey="source"
              valueFormatter={(value) => {
                const percentage =
                  totalIncome > 0
                    ? ((Number(value) / totalIncome) * 100).toFixed(1)
                    : 0;
                return `$${Number(value).toLocaleString()} (${percentage}%)`;
              }}
            />
          }
        />
        <Pie
          data={data}
          dataKey="amount"
          nameKey="source"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry) => (
             <Cell key={`cell-${entry.source}`} fill={`var(--color-${entry.source})`} />
          ))}
        </Pie>
        <ChartLegend
            content={<ChartLegendContent nameKey="source" />}
            className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
      </PieChart>
    </ChartContainer>
  );
}
