
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig
} from "@/components/ui/chart";
import { type YearlyStatsData } from '@/lib/data/yearly-stats-data';
import { Button } from '@/components/ui/button';
import { BarChart2, LineChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface MyOrdersVsCompetitorAvgChartProps {
    allYearlyData: YearlyStatsData;
    selectedYear: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
];

const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9_]/g, '');

export default function MyOrdersVsCompetitorAvgChart({ allYearlyData, selectedYear }: MyOrdersVsCompetitorAvgChartProps) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    
    const { chartData, chartConfig, legendStats } = useMemo(() => {
        const legendData: Record<string, { label: string; total: number; avg: number; }> = {};
        const config: ChartConfig = {};
        
        const data: { month: string; [key: string]: string | number }[] = months.map((month) => ({ month }));

        const yearData = allYearlyData[selectedYear];
        const myOrdersKey = 'myOrders';
        const competitorAvgKey = 'competitorAvg';

        config[myOrdersKey] = { label: 'My Orders', color: chartColors[0] };
        config[competitorAvgKey] = { label: 'Competitor Avg.', color: chartColors[1] };

        months.forEach((month, index) => {
            const competitorTotalForMonth = yearData.competitors.reduce((acc, curr) => acc + curr.monthlyOrders[index], 0);
            const competitorAvgForMonth = yearData.competitors.length > 0 ? competitorTotalForMonth / yearData.competitors.length : 0;
            data[index][myOrdersKey] = yearData.monthlyOrders[index];
            data[index][competitorAvgKey] = Math.round(competitorAvgForMonth);
        });

        const myOrdersTotal = yearData.myTotalYearlyOrders;
        const competitorAvgTotal = data.reduce((s, c) => s + (c.competitorAvg as number), 0);
        
        legendData[myOrdersKey] = {
            label: 'My Orders',
            total: myOrdersTotal,
            avg: Math.round(myOrdersTotal / 12),
        };
        legendData[competitorAvgKey] = {
            label: 'Competitor Avg.',
            total: competitorAvgTotal,
            avg: Math.round(competitorAvgTotal / 12),
        };

        return { chartData: data, chartConfig: config, legendStats: legendData };
    }, [selectedYear, allYearlyData]);

    const ChartTooltipContentCustom = (
        <ChartTooltipContent
            indicator="dot"
            labelClassName="font-semibold"
            nameKey="name"
        />
    );

    const CustomLegend = (props: any) => {
      const { payload } = props;
      const formatNumber = (value: number) => value.toLocaleString();

      return (
        <div className="flex justify-center gap-4 pt-4 flex-wrap">
          {payload.map((entry: any, index: number) => {
            const key = entry.value as keyof typeof legendStats;
            const stats = legendStats[key];
            if (!stats) return null;

            return (
                <div key={`item-${index}`} className="flex items-center space-x-2 rounded-lg border bg-background/50 px-4 py-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-foreground">{stats.label}</span>
                        <div className="flex gap-2 text-muted-foreground">
                            <span>Total: <span className="font-medium text-foreground/90">{formatNumber(stats.total)}</span></span>
                            <span>Avg: <span className="font-medium text-foreground/90">{formatNumber(stats.avg)}</span></span>
                        </div>
                    </div>
                </div>
            );
          })}
        </div>
      );
    }

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
                <div>
                    <CardTitle>My Orders vs. Average Competitor Orders (Monthly)</CardTitle>
                    <CardDescription>A comparison of your monthly orders against the average of your competitors for {selectedYear}.</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setChartType('bar')}
                        aria-label="Switch to Bar Chart"
                    >
                        <BarChart2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Bar</span>
                    </Button>
                    <Button
                        variant={chartType === 'line' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setChartType('line')}
                        aria-label="Switch to Line Chart"
                    >
                        <LineChartIcon className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Line</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full min-h-[400px]">
                    {chartType === 'bar' ? (
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
                                content={ChartTooltipContentCustom}
                            />
                            <ChartLegend content={<CustomLegend />} />
                            {Object.keys(chartConfig).map(key => (
                                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
                            ))}
                        </BarChart>
                    ) : (
                         <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
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
                                content={ChartTooltipContentCustom}
                            />
                            <ChartLegend content={<CustomLegend />} />
                            {Object.keys(chartConfig).map(key => (
                                <Line key={key} dataKey={key} type="monotone" stroke={`var(--color-${key})`} strokeWidth={2} dot={true} />
                            ))}
                        </LineChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
