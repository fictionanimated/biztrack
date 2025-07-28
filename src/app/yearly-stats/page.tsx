
"use client";

import { Suspense, lazy, useState, useMemo, memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { yearlyStatsData, type YearlyStatsData, type SingleYearData } from "@/lib/data/yearly-stats-data";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


const MyOrdersVsCompetitorAvgChart = lazy(() => import("@/components/yearly-stats/my-orders-vs-competitor-avg-chart"));
const TotalYearlyOrdersDistributionChart = lazy(() => import("@/components/yearly-stats/total-yearly-orders-distribution-chart"));
const MonthlyOrdersVsCompetitorsChart = lazy(() => import("@/components/yearly-stats/monthly-orders-vs-competitors-chart"));
const MonthlyFinancialsChart = lazy(() => import("@/components/yearly-stats/monthly-financials-chart"));
const MonthlyRevenueVsTargetChart = lazy(() => import("@/components/yearly-stats/monthly-revenue-vs-target-chart"));
const YearlySummaryTable = lazy(() => import("@/components/yearly-stats/yearly-summary-table"));


const YearlyStatsPageComponent = () => {
    const currentYear = new Date().getFullYear();
    const availableYears = useMemo(() => Array.from({ length: 10 }, (_, i) => currentYear - i), [currentYear]);
    const [selectedYears, setSelectedYears] = useState<number[]>([availableYears[0]]);
    
    const handleYearToggle = (year: number) => {
        setSelectedYears(prev => {
            const newSelection = prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year];
            if (newSelection.length === 0) return [year]; // Keep at least one year selected
            return newSelection.sort((a,b) => b-a);
        });
    };

    const singleSelectedYear = selectedYears[selectedYears.length - 1] || availableYears[0];
    const selectedYearData = yearlyStatsData[singleSelectedYear];
    
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Yearly Stats
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {selectedYears.length > 1 ? `${selectedYears.length} years selected` : `Year: ${selectedYears[0]}`}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Years</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableYears.map(year => (
                        <DropdownMenuCheckboxItem
                            key={year}
                            checked={selectedYears.includes(year)}
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={() => handleYearToggle(year)}
                        >
                            {year}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[500px] lg:col-span-2" />}>
            <MyOrdersVsCompetitorAvgChart allYearlyData={yearlyStatsData} selectedYears={selectedYears}/>
        </Suspense>
        
        {selectedYearData ? (
          <Card>
             <CardHeader>
                <CardTitle>Total Yearly Orders Distribution</CardTitle>
                <CardDescription>A pie chart showing the market share of orders between you and your competitors for {singleSelectedYear}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px]" />}>
                   <TotalYearlyOrdersDistributionChart yearData={selectedYearData} />
                </Suspense>
            </CardContent>
          </Card>
        ) : <Skeleton className="h-[400px]" />}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[500px]" />}>
          <MonthlyOrdersVsCompetitorsChart allYearlyData={yearlyStatsData} selectedYears={selectedYears} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[500px]" />}>
            <MonthlyRevenueVsTargetChart allYearlyData={yearlyStatsData} selectedYears={selectedYears} />
        </Suspense>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={<Skeleton className="h-[500px]" />}>
              <MonthlyFinancialsChart allYearlyData={yearlyStatsData} selectedYears={selectedYears} />
          </Suspense>
      </div>
      
      {selectedYearData && (
        <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={<Skeleton className="h-[500px]" />}>
            <YearlySummaryTable allYearlyData={yearlyStatsData} selectedYear={singleSelectedYear} />
          </Suspense>
        </div>
      )}

    </main>
  );
}

const MemoizedYearlyStatsPage = memo(YearlyStatsPageComponent);

export default function YearlyStatsPage() {
  return <MemoizedYearlyStatsPage />;
}
