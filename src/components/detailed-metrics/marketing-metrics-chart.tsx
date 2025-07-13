
"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Dot } from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '../ui/separator';
import { BookText } from 'lucide-react';

const chartData = [
  { month: "Jan", cpl: 35.0, romi: 320 },
  { month: "Feb", cpl: 32.5, romi: 380 },
  { month: "Mar", cpl: 30.0, romi: 400, note: "Optimized ad campaigns." },
  { month: "Apr", cpl: 28.5, romi: 425 },
  { month: "May", cpl: 27.0, romi: 440 },
  { month: "Jun", cpl: 25.5, romi: 450 },
];

const chartConfig = {
    cpl: { label: "Cost per Lead (CPL)", color: "hsl(var(--chart-1))" },
    romi: { label: "Marketing ROI (ROMI %)", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface MarketingMetricsChartProps {
    activeMetrics: Record<string, boolean>;
    onMetricToggle: (metric: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const note = payload[0].payload.note;
    return (
      <div className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((pld: any) => (
          pld.value ? (
            <div key={pld.dataKey} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: pld.color || pld.stroke || pld.fill }} />
                <span>{chartConfig[pld.dataKey as keyof typeof chartConfig]?.label}:</span>
              </div>
              <span className="ml-4 font-mono font-medium">
                {typeof pld.dataKey === 'string' && pld.dataKey.includes('cpl') ? `$${(pld.value as number).toFixed(2)}` : `${pld.value}%`}
              </span>
            </div>
          ) : null
        ))}
        {note && (
          <>
            <Separator className="my-2" />
            <div className="flex items-start gap-2 text-muted-foreground">
              <BookText className="size-4 shrink-0 mt-0.5" />
              <p className="font-medium">{note}</p>
            </div>
          </>
        )}
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.note) {
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={5}
        fill="hsl(var(--primary))"
        stroke="hsl(var(--background))"
        strokeWidth={2}
      />
    );
  }
  return null;
};

export default function MarketingMetricsChart({ activeMetrics, onMetricToggle }: MarketingMetricsChartProps) {
    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Marketing Metrics Trend</CardTitle>
                        <CardDescription>Monthly trends for key marketing metrics.</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {Object.keys(chartConfig).map((metric) => (
                            <div key={metric} className="flex items-center gap-2">
                                <Checkbox
                                    id={`marketing-metric-${metric}`}
                                    checked={activeMetrics[metric as keyof typeof activeMetrics]}
                                    onCheckedChange={() => onMetricToggle(metric as keyof typeof activeMetrics)}
                                    style={{
                                        '--chart-color': chartConfig[metric as keyof typeof chartConfig].color,
                                    } as React.CSSProperties}
                                    className="data-[state=checked]:bg-[var(--chart-color)] data-[state=checked]:border-[var(--chart-color)] border-muted-foreground"
                                />
                                <Label htmlFor={`marketing-metric-${metric}`} className="capitalize">
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
                            yAxisId="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `$${value}`}
                        />
                         <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            cursor={false}
                            content={<CustomTooltip />}
                        />
                        {activeMetrics.cpl && <Line yAxisId="left" dataKey="cpl" type="monotone" stroke="var(--color-cpl)" strokeWidth={2} dot={<CustomDot />} />}
                        {activeMetrics.romi && <Line yAxisId="right" dataKey="romi" type="monotone" stroke="var(--color-romi)" strokeWidth={2} dot={<CustomDot />} />}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
