
"use client";

import { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { CompetitorYearlyData } from '@/lib/data/yearly-stats-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MonthlyOrdersVsCompetitorsChartProps {
    myOrders: number[];
    competitors: CompetitorYearlyData[];
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

export default function MonthlyOrdersVsCompetitorsChart({ myOrders, competitors }: MonthlyOrdersVsCompetitorsChartProps) {
    
    const { chartData, chartConfig, metricKeys } = useMemo(() => {
        const myOrdersKey = sanitizeKey('My Orders');
        const competitorKeys = competitors.map(c => sanitizeKey(c.name));
        const allKeys = [myOrdersKey, ...competitorKeys];
        
        const data = months.map((month, index) => {
            const entry: { month: string; [key: string]: string | number } = { month };
            entry[myOrdersKey] = myOrders[index];
            competitors.forEach((c, i) => {
                entry[competitorKeys[i]] = c.monthlyOrders[index];
            });
            return entry;
        });

        const config: ChartConfig = {
            [myOrdersKey]: { label: 'My Orders', color: chartColors[0] },
        };
        competitors.forEach((c, i) => {
            config[competitorKeys[i]] = {
                label: c.name,
                color: chartColors[(i + 1) % chartColors.length]
            };
        });

        return { chartData: data, chartConfig: config, metricKeys: allKeys };
    }, [myOrders, competitors]);
    
    const [activeMetrics, setActiveMetrics] = useState<Record<string, boolean>>(() => 
        metricKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const handleMetricToggle = (metric: string) => {
        setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <h4 className="font-semibold mb-2">Display Lines</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Select which lines to show on the graph.
                </p>
                <ScrollArea className="h-96 rounded-md border p-2">
                     <div className="space-y-2">
                        {Object.entries(chartConfig).map(([metricKey, config]) => (
                            <div key={metricKey} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                                <Checkbox
                                    id={`metric-${metricKey}`}
                                    checked={activeMetrics[metricKey]}
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
            <div className="md:col-span-3">
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
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
                        {Object.entries(activeMetrics).map(([key, isActive]) => 
                            isActive && (
                                <Line
                                    key={key}
                                    dataKey={key}
                                    type="monotone"
                                    strokeWidth={key === sanitizeKey("My Orders") ? 2.5 : 2}
                                    stroke={`var(--color-${key})`}
                                    dot={key === sanitizeKey("My Orders")}
                                    strokeDasharray={key === sanitizeKey("My Orders") ? undefined : "3 3"}
                                />
                            )
                        )}
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
    );
}
