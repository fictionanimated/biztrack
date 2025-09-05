
"use client";

import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { format, subDays, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUp, ArrowDown, EyeOff, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { ConversionMetricData } from "@/lib/services/analyticsService";

interface ConversionMetricsProps {
    date: DateRange | undefined;
    selectedSources: string[];
}

export function SalesMetrics({ date, selectedSources }: ConversionMetricsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<ConversionMetricData | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    async function fetchData() {
        if (!date?.from || !date?.to || selectedSources.length === 0) {
            setIsLoading(false);
            setMetrics(null);
            return;
        };
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                from: format(date.from, 'yyyy-MM-dd'),
                to: format(date.to, 'yyyy-MM-dd'),
                sources: selectedSources.join(','),
            });
            const res = await fetch(`/api/analytics/conversion-metrics?${query.toString()}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch conversion metrics');
            }
            const data: ConversionMetricData = await res.json();
            setMetrics(data);
        } catch (e) {
            console.error("Error fetching conversion metrics:", e);
            toast({
                variant: "destructive",
                title: "Error",
                description: (e as Error).message || "Could not load conversion metrics.",
            });
            setMetrics(null);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [date, selectedSources, toast]);

  const previousPeriodLabel = useMemo(() => {
    if (!date?.from || !date?.to) return "previous period";
    const duration = differenceInDays(date.to, date.from);
    const prevTo = subDays(date.from, 1);
    const prevFrom = subDays(prevTo, duration);
    return `from ${format(prevFrom, 'MMM d')} to ${format(prevTo, 'MMM d')}`;
  }, [date]);


  const leadConversionRate = useMemo(() => {
    if (!metrics) return null;
    return {
        name: "Lead Conversion Rate (%)",
        value: `${metrics.leadConversionRate.value.toFixed(1)}%`,
        formula: "(Total Orders / Total Messages) × 100",
        change: metrics.leadConversionRate.change,
        changeType: metrics.leadConversionRate.change >= 0 ? "increase" : "decrease" as const,
    };
  }, [metrics]);

  const renderContent = () => {
    if (isLoading) {
        return <Skeleton className="h-[150px] w-full" />;
    }
    if (!leadConversionRate) {
        return <p className="text-muted-foreground">Could not load conversion data. Please select a valid date range and at least one income source.</p>
    }

    const { name, value, formula, change, changeType } = leadConversionRate;
    const isPositive = changeType === "increase";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{name}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex items-center text-xs">
                        <span
                            className={cn(
                                "flex items-center gap-1 font-semibold",
                                isPositive ? "text-green-600" : "text-red-600"
                            )}
                        >
                            {changeType === "increase" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {change.toFixed(1)}%
                        </span>
                        <span className="ml-1 text-muted-foreground">vs {previousPeriodLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{formula}</p>
                </div>
            </div>
        </div>
    );
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span>Conversion and Performance Metrics</span>
        </CardTitle>
        <Button variant="outline" size="sm" disabled>
            <BarChart className="mr-2 h-4 w-4" />
            Show Graph
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
