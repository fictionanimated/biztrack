
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { FinancialMetricTimeSeries } from '@/lib/services/analyticsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart2, LineChartIcon } from 'lucide-react';
import { format, parseISO, startOfWeek, startOfMonth, getQuarter, getYear } from "date-fns";

const chartConfig = {
    cac: { label: "CAC", color: "hsl(var(--chart-4))" },
    cltv: { label: "CLTV", color: "hsl(var(--chart-5))" },
    aov: { label: "AOV", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

type ChartView = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export default function CustomerValueChart({ timeSeries }: { timeSeries: FinancialMetricTimeSeries[] }) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    const [chartView, setChartView] = useState<ChartView>('monthly');
    const [activeMetrics, setActiveMetrics] = useState({
        cac: true,
        cltv: true,
        aov: true,
    });

    const handleMetricToggle = (metric: keyof typeof activeMetrics) => {
        setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    const aggregatedData = useMemo(() => {
        if (!timeSeries || timeSeries.length === 0) return [];
        const dataMap = new Map<string, any>();

        timeSeries.forEach(item => {
            const itemDate = parseISO(item.date);
            let key = '';

            switch(chartView) {
                case 'daily': key = item.date; break;
                case 'weekly': key = format(startOfWeek(itemDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'); break;
                case 'monthly': key = format(startOfMonth(itemDate), 'yyyy-MM-dd'); break;
                case 'quarterly': key = `${getYear(itemDate)}-Q${getQuarter(itemDate)}`; break;
                case 'yearly': key = getYear(itemDate).toString(); break;
            }

            const existing = dataMap.get(key) || { date: key, cac: 0, cltv: 0, aov: 0, totalRevenue: 0, totalOrders: 0 };
            existing.cac += item.cac;
            existing.cltv += item.cltv;
            existing.totalRevenue += item.totalRevenue;
            existing.totalOrders += (item.aov > 0 ? item.totalRevenue / item.aov : 0); // Reverse calculate orders if not present
            dataMap.set(key, existing);
        });

        const result = Array.from(dataMap.values()).map(item => {
            const aov = item.totalOrders > 0 ? item.totalRevenue / item.totalOrders : 0;
            return { ...item, aov };
        });
        
        return result.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [timeSeries, chartView]);

    const tickFormatter = (value: string) => {
        try {
            switch (chartView) {
                case 'daily': return format(parseISO(value), "MMM d");
                case 'weekly': return `W/C ${format(parseISO(value), "MMM d")}`;
                case 'monthly': return format(parseISO(value), "MMM yyyy");
                case 'quarterly': return value;
                case 'yearly': return value;
                default: return value;
            }
        } catch (e) {
            return value;
        }
    };
    
    const Chart = chartType === 'bar' ? BarChart : LineChart;
    const ChartComponent = chartType === 'bar' ? Bar : Line;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Customer Value Metrics</CardTitle>
                        <CardDescription>CAC, CLTV, and AOV over time.</CardDescription>
                    </div>
                     <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1">
                            <Button variant={chartType === 'bar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChartType('bar')}>
                                <BarChart2 className="h-4 w-4" />
                            </Button>
                            <Button variant={chartType === 'line' ? 'secondary' : 'ghost'} size="sm" onClick={() => setChartType('line')}>
                                <LineChartIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <Select value={chartView} onValueChange={(v) => setChartView(v as ChartView)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-4">
                    {Object.keys(chartConfig).map(metric => (
                        <div key={metric} className="flex items-center gap-2">
                            <Checkbox id={`financial-${metric}`} checked={activeMetrics[metric as keyof typeof activeMetrics]} onCheckedChange={() => handleMetricToggle(metric as keyof typeof activeMetrics)} />
                            <Label htmlFor={`financial-${metric}`}>{chartConfig[metric as keyof typeof chartConfig].label}</Label>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <Chart data={aggregatedData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={tickFormatter} />
                        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                         {Object.keys(activeMetrics).filter(k => activeMetrics[k as keyof typeof activeMetrics]).map(key => (
                           <ChartComponent key={key} dataKey={key} fill={`var(--color-${key})`} stroke={`var(--color-${key})`} radius={chartType === 'bar' ? 4 : undefined} dot={chartType === 'line' ? false : undefined} />
                        ))}
                    </Chart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
