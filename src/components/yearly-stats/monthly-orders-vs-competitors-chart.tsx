
"use client";

import { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { YearlyStatsData } from '@/lib/data/yearly-stats-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthlyOrdersVsCompetitorsChartProps {
    allYearlyData: YearlyStatsData;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9_]/g, '_');

export default function MonthlyOrdersVsCompetitorsChart({ allYearlyData }: MonthlyOrdersVsCompetitorsChartProps) {
    const availableYears = useMemo(() => Object.keys(allYearlyData).map(Number).sort((a,b) => a - b), [allYearlyData]);
    const [isYoY, setIsYoY] = useState(false);
    const [startYear, setStartYear] = useState(availableYears[0]);
    const [endYear, setEndYear] = useState(availableYears[availableYears.length - 1]);
    const [baseYearForCompetitors, setBaseYearForCompetitors] = useState(availableYears[availableYears.length - 1]);

    const competitorData = useMemo(() => {
        return allYearlyData[baseYearForCompetitors]?.competitors || [];
    }, [allYearlyData, baseYearForCompetitors]);

    const { chartData, chartConfig, metricKeys } = useMemo(() => {
        if (isYoY) {
            const selectedYears = availableYears.filter(y => y >= startYear && y <= endYear);
            const data = months.map((month, index) => {
                const entry: { month: string; [key: string]: string | number } = { month };
                selectedYears.forEach(year => {
                    entry[String(year)] = allYearlyData[year].monthlyOrders[index];
                });
                return entry;
            });
            const config: ChartConfig = {};
            selectedYears.forEach((year, i) => {
                config[String(year)] = { label: String(year), color: chartColors[i % chartColors.length] };
            });
            return { chartData: data, chartConfig: config, metricKeys: selectedYears.map(String) };
        } else {
            const myOrders = allYearlyData[baseYearForCompetitors].monthlyOrders;
            const myOrdersKey = sanitizeKey('My Orders');
            const competitorKeys = competitorData.map(c => sanitizeKey(c.name));
            const data = months.map((month, index) => {
                const entry: { month: string; [key: string]: string | number } = { month };
                entry[myOrdersKey] = myOrders[index];
                competitorData.forEach((c) => {
                    entry[sanitizeKey(c.name)] = c.monthlyOrders[index];
                });
                return entry;
            });
            const config: ChartConfig = { [myOrdersKey]: { label: 'My Orders', color: chartColors[0] } };
            competitorData.forEach((c, i) => {
                config[sanitizeKey(c.name)] = { label: c.name, color: chartColors[(i + 1) % chartColors.length] };
            });
            return { chartData: data, chartConfig: config, metricKeys: [myOrdersKey, ...competitorKeys] };
        }
    }, [isYoY, startYear, endYear, baseYearForCompetitors, allYearlyData, competitorData, availableYears]);
    
    const [activeMetrics, setActiveMetrics] = useState<Record<string, boolean>>({});

    // Effect to update active metrics when view changes
    useMemo(() => {
        setActiveMetrics(metricKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }, [metricKeys]);

    const handleMetricToggle = (metric: string) => {
        setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-1">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="yoy-checkbox" checked={isYoY} onCheckedChange={(checked) => setIsYoY(!!checked)} />
                        <Label htmlFor="yoy-checkbox" className="font-semibold">Year-over-Year</Label>
                    </div>
                    
                    {isYoY ? (
                        <div className="space-y-2">
                            <Label>From</Label>
                            <Select value={String(startYear)} onValueChange={(v) => setStartYear(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(y => <SelectItem key={y} value={String(y)} disabled={y > endYear}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Label>To</Label>
                             <Select value={String(endYear)} onValueChange={(v) => setEndYear(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(y => <SelectItem key={y} value={String(y)} disabled={y < startYear}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>Competitor Data Year</Label>
                                <Select value={String(baseYearForCompetitors)} onValueChange={(v) => setBaseYearForCompetitors(Number(v))}>
                                     <SelectTrigger><SelectValue /></SelectTrigger>
                                     <SelectContent>
                                        {availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                                     </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 mt-4">Display Lines</h4>
                                <p className="text-sm text-muted-foreground mb-4">Toggle lines on the graph.</p>
                                <ScrollArea className="h-60 rounded-md border p-2">
                                    <div className="space-y-2">
                                        {Object.entries(chartConfig).map(([metricKey, config]) => (
                                            <div key={metricKey} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                                <Checkbox
                                                    id={`metric-${metricKey}`}
                                                    checked={!!activeMetrics[metricKey]}
                                                    onCheckedChange={() => handleMetricToggle(metricKey)}
                                                    style={{ '--chart-color': config.color } as React.CSSProperties}
                                                    className="data-[state=checked]:bg-[var(--chart-color)] data-[state=checked]:border-[var(--chart-color)] border-muted-foreground"
                                                />
                                                <Label htmlFor={`metric-${metricKey}`} className="flex-1 cursor-pointer font-normal">
                                                    {config.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="md:col-span-4">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {Object.entries(activeMetrics).map(([key, isActive]) => 
                            isActive && (
                                <Line
                                    key={key}
                                    dataKey={key}
                                    type="monotone"
                                    strokeWidth={isYoY ? 2 : (key === sanitizeKey("My Orders") ? 2.5 : 2)}
                                    stroke={`var(--color-${key})`}
                                    dot={isYoY || key === sanitizeKey("My Orders")}
                                    strokeDasharray={isYoY ? undefined : (key === sanitizeKey("My Orders") ? undefined : "3 3")}
                                />
                            )
                        )}
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
    );
}
