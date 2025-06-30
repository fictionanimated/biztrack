
"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { BarChart2, LineChartIcon } from "lucide-react";

interface Order {
    date: string;
    amount: number;
    id: string;
}

interface ClientOrderHistoryChartProps {
    data: Order[];
}

const chartConfig = {
    amount: {
        label: "Order Amount",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

// A more robust date parsing function to avoid performance issues.
const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // In JavaScript's Date, months are 0-indexed (0 for January, 11 for December)
  return new Date(year, month - 1, day);
};

export default function ClientOrderHistoryChart({ data }: ClientOrderHistoryChartProps) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const chartData = useMemo(() => {
        return data
            .map(order => ({
                ...order,
                dateObj: parseDateString(order.date),
            }))
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
            .map(order => ({
                ...order,
                dateLabel: order.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }));
    }, [data]);

    const ChartTooltipContentCustom = (
        <ChartTooltipContent 
            formatter={(value) => [`$${(value as number).toFixed(2)}`, "Amount"]}
            labelFormatter={(label, payload) => {
                const order = payload?.[0]?.payload;
                if (!order) return label;
                return (
                    <div>
                        <div>{order.dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div className="text-xs text-muted-foreground">ID: {order.id}</div>
                    </div>
                )
            }}
            indicator="dot" 
        />
    );


    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Order History Graph</CardTitle>
                    <CardDescription>A visual representation of the client's orders over time.</CardDescription>
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
            <CardContent className="pl-2">
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                       {chartType === 'bar' ? (
                            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 50, left: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="dateLabel"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))' }}
                                    content={ChartTooltipContentCustom}
                                />
                                <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                            </BarChart>
                       ) : (
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 50, left: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="dateLabel"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={false}
                                    content={ChartTooltipContentCustom}
                                />
                                <Line dataKey="amount" type="monotone" stroke="var(--color-amount)" strokeWidth={2} dot={false} activeDot={{ r: 6 }}/>
                            </LineChart>
                       )}
                    </ChartContainer>
                ) : (
                    <div className="flex h-[300px] w-full items-center justify-center">
                        <p className="text-muted-foreground">No order data to display chart.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
