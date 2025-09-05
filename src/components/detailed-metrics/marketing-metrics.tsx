
"use client";

import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, ArrowUp, ArrowDown, EyeOff, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRange } from "react-day-picker";
import { format, subDays, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const MarketingMetricsChart = lazy(() => import("@/components/detailed-metrics/marketing-metrics-chart"));

interface MarketingMetricsProps {
    date: DateRange | undefined;
    selectedSources: string[];
}

interface MarketingMetric {
    value: number;
    change: number;
    previousValue: number;
}

interface MarketingMetricData {
    cpl: MarketingMetric;
    romi: MarketingMetric;
}

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function MarketingMetrics({ date, selectedSources }: MarketingMetricsProps) {
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MarketingMetricData | null>(null);
  const { toast } = useToast();

  const [activeMetrics, setActiveMetrics] = useState({
    cpl: true,
    romi: false,
  });

  const handleMetricToggle = (metric: keyof typeof activeMetrics) => {
    setActiveMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

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
            const res = await fetch(`/api/analytics/marketing-metrics?${query.toString()}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch marketing metrics');
            }
            const data: MarketingMetricData = await res.json();
            setMetrics(data);
        } catch (e) {
            console.error("Error fetching marketing metrics:", e);
            toast({
                variant: "destructive",
                title: "Error",
                description: (e as Error).message || "Could not load marketing metrics.",
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
      metricData: MarketingMetric,
      formula: string,
      invertColor = false,
      isPercentage = false
  ) => {
      const { value, change, previousValue } = metricData;

      const changeType = change >= 0 ? "increase" : "decrease";
      const isPositive = invertColor ? changeType === "decrease" : changeType === "increase";

      const displayValue = isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value);
      const displayPreviousValue = isPercentage ? `${previousValue.toFixed(1)}%` : formatCurrency(previousValue);
      const displayChange = isPercentage ? `${Math.abs(change).toFixed(1)}%` : `${Math.abs(change).toFixed(1)}%`;

      return (
          <div key={name} className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
              <div>
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">{name}</p>
                      {change != null && (
                          <span className={cn("flex items-center gap-1 text-xs font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
                              {changeType === "increase" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                              {displayChange}
                          </span>
                      )}
                  </div>
                  <p className="text-2xl font-bold mt-1">{displayValue}</p>
              </div>
              <div className="mt-2 pt-2 border-t space-y-1 text-xs">
                   <p className="text-muted-foreground">vs {displayPreviousValue} ({previousPeriodLabel})</p>
                   <p className="text-muted-foreground pt-1">{formula}</p>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[180px] w-full" />
                <Skeleton className="h-[180px] w-full" />
            </div>
        )
    }
    
    if (!metrics) {
        return <p className="text-muted-foreground">Could not load marketing data. Please select a valid date range and at least one income source.</p>
    }

    const metricsToShow = [
        { name: "Cost per Lead (CPL)", data: metrics.cpl, formula: "Total Marketing Spend / Total Messages", invertColor: true },
        { name: "Marketing ROI (ROMI)", data: metrics.romi, formula: "((Revenue - Cost) / Cost) × 100", isPercentage: true },
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metricsToShow.map(m => renderMetricCard(m.name, m.data, m.formula, m.invertColor, m.isPercentage))}
        </div>
    )
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <span>Marketing Metrics</span>
        </CardTitle>
         <Button variant="outline" size="sm" onClick={() => setShowChart(!showChart)} disabled>
            {showChart ? <EyeOff className="mr-2 h-4 w-4" /> : <BarChart className="mr-2 h-4 w-4" />}
            {showChart ? "Hide Graph" : "Show Graph"}
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      {showChart && (
        <CardContent>
             <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <MarketingMetricsChart activeMetrics={activeMetrics} onMetricToggle={handleMetricToggle} />
            </Suspense>
        </CardContent>
      )}
    </Card>
  );
}
