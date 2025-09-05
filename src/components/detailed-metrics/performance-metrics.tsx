
"use client";

import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, EyeOff, BarChart, Eye, MousePointerClick, MessageSquare, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRange } from "react-day-picker";
import { format, subDays, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const formatValue = (value: number, type: 'number' | 'currency' | 'percentage') => {
    switch (type) {
        case 'currency': return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        case 'percentage': return `${value.toFixed(1)}%`;
        default: return value.toLocaleString();
    }
}

const dummyMetrics = [
    { name: "Impressions", value: 1250000, change: 12.5, previousValue: 1100000, previousPeriodChange: 10.2, type: 'number', formula: "Total views of your gigs/profiles" },
    { name: "Clicks", value: 75000, change: 8.2, previousValue: 69316, previousPeriodChange: 7.5, type: 'number', formula: "Total clicks on your gigs/profiles" },
    { name: "Click-Through Rate (CTR)", value: 6.0, change: -3.8, previousValue: 6.3, previousPeriodChange: -0.5, type: 'percentage', formula: "(Clicks / Impressions) * 100" },
];

interface PerformanceMetricsProps {
    date: DateRange | undefined;
    selectedSources: string[];
}

interface PerformanceMetricData {
    messages: {
        value: number;
        change: number;
        previousValue: number;
    };
}

export function PerformanceMetrics({ date, selectedSources }: PerformanceMetricsProps) {
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetricData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        if (!date?.from || !date?.to || selectedSources.length === 0) {
            setIsLoading(false);
            setMetrics(null);
            return;
        }
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                from: format(date.from, 'yyyy-MM-dd'),
                to: format(date.to, 'yyyy-MM-dd'),
                sources: selectedSources.join(','),
            });
            const res = await fetch(`/api/analytics/performance-metrics?${query.toString()}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch performance metrics');
            }
            const data: PerformanceMetricData = await res.json();
            setMetrics(data);
        } catch (e) {
            console.error("Error fetching performance metrics:", e);
            toast({
                variant: "destructive",
                title: "Error",
                description: (e as Error).message || "Could not load performance metrics.",
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

  const renderMetricCard = (
      name: string,
      data: { value: number, change: number, previousValue: number, previousPeriodChange?: number },
      formula: string,
      type: 'number' | 'percentage' = 'number',
      invertColor = false
  ) => {
      const { value, change, previousValue, previousPeriodChange } = data;
      
      const changeType = change >= 0 ? "increase" : "decrease";
      const isPositive = invertColor ? changeType === "decrease" : changeType === "increase";

      const prevChangeType = previousPeriodChange && previousPeriodChange >= 0 ? "increase" : "decrease";
      const isPrevPositive = previousPeriodChange ? (invertColor ? prevChangeType === "decrease" : prevChangeType === "increase") : false;

      const displayValue = formatValue(value, type);
      const displayPreviousValue = formatValue(previousValue, type);

      return (
          <div key={name} className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
              <div>
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">{name}</p>
                      {change != null && (
                          <span className={cn("flex items-center gap-1 text-xs font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
                              {changeType === "increase" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              {`${Math.abs(change).toFixed(1)}%`}
                          </span>
                      )}
                  </div>
                  <p className="text-2xl font-bold mt-1">{displayValue}</p>
              </div>
              <div className="mt-2 pt-2 border-t space-y-1 text-xs">
                   {previousPeriodChange != null && (
                        <p className={cn("flex items-center gap-1 font-semibold", isPrevPositive ? "text-green-600" : "text-red-600")}>
                            {prevChangeType === "increase" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {`${Math.abs(previousPeriodChange).toFixed(1)}%`}
                        </p>
                   )}
                   <p className="text-muted-foreground">vs {displayPreviousValue} ({previousPeriodLabel})</p>
                   <p className="text-muted-foreground pt-1">{formula}</p>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyMetrics.map(m => renderMetricCard(m.name, { ...m, previousPeriodChange: m.previousPeriodChange }, m.formula, m.type as any))}
        {isLoading ? (
          <Skeleton className="h-[180px] w-full" />
        ) : metrics ? (
          renderMetricCard("Messages", metrics.messages, "Total initial messages from new clients")
        ) : (
          <div className="rounded-lg border bg-background/50 p-4 flex flex-col justify-center items-center">
            <p className="text-sm text-muted-foreground text-center">Could not load Messages data. Please select a valid date range and source.</p>
          </div>
        )}
      </div>
    )
  };

  return (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  Performance Metrics
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowChart(!showChart)} disabled>
                  {showChart ? <EyeOff className="mr-2 h-4 w-4" /> : <BarChart className="mr-2 h-4 w-4" />} {showChart ? "Hide Graph" : "Show Graph"}
              </Button>
          </CardHeader>
          <CardContent>
              {renderContent()}
          </CardContent>
           {showChart && (
            <CardContent>
                <p className="text-muted-foreground">Chart for performance metrics will be available soon.</p>
            </CardContent>
          )}
      </Card>
  );
}
