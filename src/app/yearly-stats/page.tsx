
"use client";

import { Suspense, lazy, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { yearlyStatsData } from "@/lib/data/yearly-stats-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const MyOrdersVsCompetitorAvgChart = lazy(() => import("@/components/yearly-stats/my-orders-vs-competitor-avg-chart"));
const TotalYearlyOrdersDistributionChart = lazy(() => import("@/components/yearly-stats/total-yearly-orders-distribution-chart"));
const MonthlyOrdersVsCompetitorsChart = lazy(() => import("@/components/yearly-stats/monthly-orders-vs-competitors-chart"));
const MonthlyFinancialsChart = lazy(() => import("@/components/yearly-stats/monthly-financials-chart"));
const MonthlyRevenueVsTargetChart = lazy(() => import("@/components/yearly-stats/monthly-revenue-vs-target-chart"));
const YearlySummaryTable = lazy(() => import("@/components/yearly-stats/yearly-summary-table"));


export default function YearlyStatsPage() {
    const availableYears = useMemo(() => Object.keys(yearlyStatsData).map(Number).sort((a,b) => b-a), []);
    const [selectedYear, setSelectedYear] = useState(availableYears[0]);
    
    const selectedYearData = yearlyStatsData[selectedYear];
    
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Yearly Stats
        </h1>
        <div className="ml-auto">
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <YearlySummaryTable allYearlyData={yearlyStatsData} selectedYear={selectedYear} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[500px] lg:col-span-2" />}>
            <MyOrdersVsCompetitorAvgChart allYearlyData={yearlyStatsData} selectedYear={selectedYear}/>
        </Suspense>
        <Card>
             <CardHeader>
                <CardTitle>Total Yearly Orders Distribution</CardTitle>
                <CardDescription>A pie chart showing the market share of orders between you and your competitors for {selectedYear}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px]" />}>
                   <TotalYearlyOrdersDistributionChart yearData={selectedYearData} />
                </Suspense>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Monthly Orders: You vs. Competitors</CardTitle>
            <CardDescription>A line graph showing your monthly orders compared to each of your main competitors throughout the selected year.</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full min-h-[400px]" />}>
                <MonthlyOrdersVsCompetitorsChart allYearlyData={yearlyStatsData} selectedYear={selectedYear} />
            </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Monthly Revenue, Expenses, and Profit</CardTitle>
            <CardDescription>A bar graph showing your key financial metrics for each month of the year.</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full min-h-[400px]" />}>
                <MonthlyFinancialsChart allYearlyData={yearlyStatsData} selectedYear={selectedYear} />
            </Suspense>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Monthly Revenue vs. Target Revenue</CardTitle>
            <CardDescription>A line graph comparing your actual monthly revenue against your target revenue for the year.</CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full min-h-[400px]" />}>
                <MonthlyRevenueVsTargetChart allYearlyData={yearlyStatsData} selectedYear={selectedYear} />
            </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
