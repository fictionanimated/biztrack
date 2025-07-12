
"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { CompetitorYearlyData } from '@/lib/data/yearly-stats-data';

interface MyOrdersVsCompetitorAvgChartProps {
    myOrders: number[];
    competitors: CompetitorYearlyData[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartConfig = {
  myOrders: { label: "My Orders", color: "hsl(var(--chart-1))" },
  competitorAvg: { label: "Competitor Avg.", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export default function MyOrdersVsCompetitorAvgChart({ myOrders, competitors }: MyOrdersVsCompetitorAvgChartProps) {
    const chartData = useMemo(() => {
        return months.map((month, index) => {
            const competitorTotalForMonth = competitors.reduce((acc, curr) => acc + curr.monthlyOrders[index], 0);
            const competitorAvgForMonth = competitors.length > 0 ? competitorTotalForMonth / competitors.length : 0;
            return {
                month,
                myOrders: myOrders[index],
                competitorAvg: Math.round(competitorAvgForMonth),
            };
        });
    }, [myOrders, competitors]);

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="myOrders" fill="var(--color-myOrders)" radius={4} />
                <Bar dataKey="competitorAvg" fill="var(--color-competitorAvg)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
