
"use client";

import { useMemo } from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { type SingleYearData } from '@/lib/data/yearly-stats-data';
import { Skeleton } from '../ui/skeleton';

interface TotalYearlyOrdersDistributionChartProps {
    yearsData: SingleYearData[];
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function TotalYearlyOrdersDistributionChart({ yearsData }: TotalYearlyOrdersDistributionChartProps) {
    
    const { chartData, chartConfig, totalOrders } = useMemo(() => {
        if (!yearsData || yearsData.length === 0) {
            return { chartData: [], chartConfig: {}, totalOrders: 0 };
        }

        const aggregatedData: Record<string, number> = {};
        
        // Aggregate data across all selected years
        yearsData.forEach(yearData => {
            aggregatedData["My Orders"] = (aggregatedData["My Orders"] || 0) + yearData.myTotalYearlyOrders;
            (yearData.competitors || []).forEach(competitor => {
                aggregatedData[competitor.name] = (aggregatedData[competitor.name] || 0) + competitor.totalOrders;
            });
        });

        const data = Object.entries(aggregatedData).map(([name, value], index) => ({
            name,
            value,
            color: chartColors[index % chartColors.length]
        }));
        
        const config: ChartConfig = data.reduce((acc, item) => {
            acc[item.name] = { label: item.name, color: item.color };
            return acc;
        }, {} as ChartConfig);

        const total = data.reduce((acc, curr) => acc + curr.value, 0);

        return { chartData: data, chartConfig: config, totalOrders: total };

    }, [yearsData]);

    const CustomLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4">
                {payload.map((entry: any, index: number) => {
                    const percentage = totalOrders > 0 ? ((entry.payload.value / totalOrders) * 100).toFixed(1) : 0;
                    return (
                        <div key={`item-${index}`} className="flex items-center space-x-2 text-sm">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.value}:</span>
                            <span className="font-semibold">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (totalOrders === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center">
                <p className="text-muted-foreground">No order data for this year.</p>
            </div>
        );
    }

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        hideLabel
                        formatter={(value) => {
                            const percentage = totalOrders > 0 ? ((Number(value) / totalOrders) * 100).toFixed(1) : 0;
                            return `${Number(value).toLocaleString()} orders (${percentage}%)`;
                        }}
                    />}
                />
                <Pie data={chartData} dataKey="value" nameKey="name" strokeWidth={5}>
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                 <ChartLegend
                    content={<CustomLegend />}
                />
            </PieChart>
        </ChartContainer>
    );
}
