
"use client";

import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/dashboard/stat-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DateRange } from "react-day-picker";
import { DateFilter } from "@/components/dashboard/date-filter";
import { Skeleton } from "@/components/ui/skeleton";
import NProgressLink from "@/components/layout/nprogress-link";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import { notFound, useParams, useRouter } from 'next/navigation';
import type { GigAnalyticsData } from "@/lib/services/analyticsService";
import { useToast } from "@/hooks/use-toast";

const GigAnalyticsChart = lazy(() => import("@/components/gigs/analytics-chart"));

const chartConfig = {
    impressions: { label: "Impressions", color: "hsl(var(--chart-1))" },
    clicks: { label: "Clicks", color: "hsl(var(--chart-2))" },
    messages: { label: "Messages", color: "hsl(var(--chart-3))" },
    orders: { label: "Orders", color: "hsl(var(--chart-4))" },
    prevImpressions: { label: "Prev. Impressions", color: "hsl(var(--chart-1))" },
    prevClicks: { label: "Prev. Clicks", color: "hsl(var(--chart-2))" },
    prevMessages: { label: "Prev. Messages", color: "hsl(var(--chart-3))" },
    prevOrders: { label: "Prev. Orders", color: "hsl(var(--chart-4))" },
  } as const;


export default function GigAnalyticsPage() {
  const params = useParams();
  const gigId = params.gigId as string;
  const router = useRouter();
  const { toast } = useToast();

  const [analyticsData, setAnalyticsData] = useState<GigAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const from = subDays(today, 29);
    return { from, to: today };
  });

  const [activeMetrics, setActiveMetrics] = useState<Record<string, boolean>>({
    impressions: true,
    clicks: true,
    messages: true,
    orders: true,
  });
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
        if (!gigId) return;
        setIsLoading(true);

        const from = date?.from ? format(date.from, 'yyyy-MM-dd') : undefined;
        const to = date?.to ? format(date.to, 'yyyy-MM-dd') : undefined;

        const query = new URLSearchParams({
            ...(from && { from }),
            ...(to && { to }),
        }).toString();

        try {
            const res = await fetch(`/api/analytics/gig/${gigId}?${query}`);
            if (res.status === 404) {
                notFound();
                return;
            }
            if (!res.ok) {
                throw new Error('Failed to fetch analytics data');
            }
            const data: GigAnalyticsData = await res.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error("Error fetching gig analytics:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not load analytics data for this gig."
            })
        } finally {
            setIsLoading(false);
        }
    }
    fetchAnalytics();
  }, [gigId, date, toast]);

  const handleMetricToggle = (metric: keyof typeof chartConfig) => {
    setActiveMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const statCards = useMemo(() => {
      if (!analyticsData) return [];
      const { totals } = analyticsData;
      return [
          {
              icon: "DollarSign", title: "Revenue", value: `$${totals.revenue.toFixed(2)}`,
              description: `from ${totals.orders} orders`,
          },
          {
              icon: "ShoppingCart", title: "Orders", value: totals.orders.toString(),
              description: "in selected period",
          },
          {
              icon: "Eye", title: "Impressions", value: totals.impressions.toLocaleString(),
              description: "in selected period",
          },
          {
              icon: "MousePointerClick", title: "Clicks", value: totals.clicks.toLocaleString(),
              description: "in selected period",
          },
          {
              icon: "Percent", title: "Click-Through Rate (CTR)", value: `${totals.ctr.toFixed(2)}%`,
              description: "Clicks / Impressions",
          },
          {
              icon: "TrendingUp", title: "Conversion Rate", value: `${totals.conversionRate.toFixed(2)}%`,
              description: "Orders / Impressions"
          },
          {
              icon: "MessageSquare", title: "Source Messages", value: totals.messages.toLocaleString(),
              description: `For entire ${analyticsData.sourceName} source`,
          },
          {
              icon: "ShoppingCart", title: "Total Source Orders", value: analyticsData.sourceTotalOrders?.toLocaleString() ?? 'N/A',
              description: `All orders from ${analyticsData.sourceName}`,
          },
      ];
  }, [analyticsData]);

  if (isLoading) {
    return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <Skeleton className="h-9 w-96" />
                <div className="ml-auto flex items-center gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-[260px]" />
                </div>
            </div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-[400px] w-full" />
       </main>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <Card className="w-full max-w-lg">
              <CardHeader>
                  <CardTitle>Could Not Load Analytics</CardTitle>
                  <CardDescription>There was an issue fetching the data for this gig. Please try again later or check if the gig exists.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button variant="outline" onClick={() => router.back()}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                  </Button>
              </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Gig Analytics: <span className="text-primary">{analyticsData.gigName}</span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <NProgressLink href="/incomes">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Incomes
                </Button>
            </NProgressLink>
            <DateFilter date={date} setDate={setDate} />
        </div>
      </div>
       <CardDescription>From Income Source: {analyticsData.sourceName}</CardDescription>

      <section>
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="lg:col-span-3">
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Impressions, Clicks, Messages & Orders</CardTitle>
                        <CardDescription>Performance over the selected period.</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).filter(k => !k.startsWith('prev')).map((metric) => (
                            <div key={metric} className="flex items-center gap-2">
                                <Checkbox
                                    id={`metric-${metric}`}
                                    checked={activeMetrics[metric as keyof typeof activeMetrics]}
                                    onCheckedChange={() => handleMetricToggle(metric as keyof typeof activeMetrics)}
                                    style={{
                                        '--chart-color': chartConfig[metric as keyof typeof chartConfig].color,
                                    } as React.CSSProperties}
                                    className="data-[state=checked]:bg-[var(--chart-color)] data-[state=checked]:border-[var(--chart-color)] border-muted-foreground"
                                />
                                <Label htmlFor={`metric-${metric}`} className="capitalize">
                                    {chartConfig[metric as keyof typeof chartConfig].label}
                                </Label>
                            </div>
                        ))}
                         <div className="flex items-center gap-2">
                            <Checkbox id="show-comparison" checked={showComparison} onCheckedChange={(c) => setShowComparison(!!c)} />
                            <Label htmlFor="show-comparison">Compare</Label>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <GigAnalyticsChart data={analyticsData.timeSeries} activeMetrics={activeMetrics} showComparison={showComparison} />
              </Suspense>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
