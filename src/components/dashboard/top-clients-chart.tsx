"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type TopClient } from "@/lib/placeholder-data";
import { DateFilter } from './date-filter';
import type { DateRange } from 'react-day-picker';

interface TopClientsChartProps {
    data: TopClient[];
    totalRevenue: number;
}

const chartConfig = {
    amount: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function TopClientsChart({ data, totalRevenue }: TopClientsChartProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 1),
        to: new Date(2023, 11, 31),
    });

    const formatter = (value: number) => {
        const percentage = totalRevenue > 0 ? ((value / totalRevenue) * 100).toFixed(1) : 0;
        return `$${value.toLocaleString()} (${percentage}%)`;
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="grid gap-1">
            <CardTitle>Top 5 Clients</CardTitle>
            <CardDescription>
              Your most valuable clients for the selected period.
            </CardDescription>
          </div>
          <DateFilter date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 100, left: 20, bottom: 5 }}
                accessibilityLayer
            >
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-sm"
                    width={80}
                />
                <XAxis dataKey="amount" type="number" hide />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4}>
                    <LabelList
                        dataKey="amount"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        formatter={formatter}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
