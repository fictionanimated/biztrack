"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const chartData = [
  { month: "Jan", profitMargin: 55.6, grossMargin: 80.0 },
  { month: "Feb", profitMargin: 56.8, grossMargin: 82.5 },
  { month: "Mar", profitMargin: 56.0, grossMargin: 81.0 },
  { month: "Apr", profitMargin: 60.0, grossMargin: 85.0 },
  { month: "May", profitMargin: 58.9, grossMargin: 84.5 },
  { month: "Jun", profitMargin: 76.7, grossMargin: 85.2 },
];

const chartConfig = {
    profitMargin: { label: "Profit Margin", color: "hsl(var(--chart-1))" },
    grossMargin: { label: "Gross Margin", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface FinancialPercentageChartProps {
    activeMetrics: Record<string, boolean>;
    onMetricToggle: (metric: string) => void;
}

export default function FinancialPercentageChart({ activeMetrics, onMetricToggle }: FinancialPercentageChartProps) {
    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Financial Metrics (Percentages)</CardTitle>
                        <CardDescription>Monthly trends for key financial percentages.</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {Object.keys(chartConfig).map((metric) => (
                            <div key={metric} className="flex items-center gap-2">
                                <Checkbox
                                    id={`financial-percentage-metric-${metric}`}
                                    checked={activeMetrics[metric as keyof typeof activeMetrics]}
                                    onCheckedChange={() => onMetricToggle(metric as keyof typeof activeMetrics)}
                                    style={{
                                        '--chart-color': chartConfig[metric as keyof typeof chartConfig].color,
                                    } as React.CSSProperties}
                                    className="data-[state=checked]:bg-[var(--chart-color)] data-[state=checked]:border-[var(--chart-color)] border-muted-foreground"
                                />
                                <Label htmlFor={`financial-percentage-metric-${metric}`} className="capitalize">
                                    {chartConfig[metric as keyof typeof chartConfig].label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                indicator="dot"
                                valueFormatter={(value) => `${value.toFixed(1)}%`}
                            />}
                        />
                        {activeMetrics.profitMargin && <Line dataKey="profitMargin" type="monotone" stroke="var(--color-profitMargin)" strokeWidth={2} dot={true} />}
                        {activeMetrics.grossMargin && <Line dataKey="grossMargin" type="monotone" stroke="var(--color-grossMargin)" strokeWidth={2} dot={true} />}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
