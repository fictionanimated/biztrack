"use client";

import { useState, useEffect } from 'react';
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, BarChart, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, differenceInDays } from 'date-fns';

// Placeholder for other financial metrics (dummy data)
const otherFinancialMetrics = [
    { name: "Total Expenses", value: "$50,000", formula: "Sum of all business expenses", change: "-5", changeType: "decrease", previousValue: "$52,500" },
    { name: "Net Profit", value: "$50,000", formula: "Total Revenue - Total Expenses", change: "+15", changeType: "increase", previousValue: "$37,500" },
    { name: "Profit Margin (%)", value: "50%", formula: "((Revenue - Expenses) / Revenue) * 100", change: "+2", changeType: "increase", previousValue: "48" },
    { name: "Gross Margin (%)", value: "60%", formula: "((Revenue - Salary) / Revenue) * 100", change: "+3", changeType: "increase", previousValue: "57" },
    { name: "Client Acquisition Cost (CAC)", value: "$100", formula: "Marketing Costs / New Clients", change: "-10", changeType: "decrease", previousValue: "$110" },
    { name: "Customer Lifetime Value (CLTV)", value: "$1,000", formula: "AOV × Repeat Purchase Rate × Avg. Lifespan", change: "+5", changeType: "increase", previousValue: "$950" },
    { name: "Average Order Value (AOV)", value: "$100", formula: "Total Revenue / Number of Orders", change: "+12", changeType: "increase", previousValue: "$88" },
];

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function FinancialMetrics({ date }: { date: DateRange | undefined }) {
    const [showChart, setShowChart] = useState(false);
    const [totalRevenueData, setTotalRevenueData] = useState<{ value: number; change: number; previousValue: number; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTotalRevenue() {
            if (!date?.from || !date?.to) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const query = new URLSearchParams({
                    from: date.from.toISOString(),
                    to: date.to.toISOString()
                });
                const res = await fetch(`/api/analytics/financials?${query.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch financial metrics');
                const data = await res.json();
                setTotalRevenueData(data.totalRevenue);
            } catch (e) {
                console.error("Error fetching total revenue:", e);
                setTotalRevenueData(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTotalRevenue();
    }, [date]);

    const previousPeriodLabel = (() => {
        if (!date?.from || !date?.to) return "previous period";
        const from = date.from;
        const to = date.to;
        const duration = differenceInDays(to, from);
        const prevTo = subDays(from, 1);
        const prevFrom = subDays(prevTo, duration);
        return `from ${format(prevFrom, 'MMM d')} - ${format(prevTo, 'MMM d, yyyy')}`;
    })();

    const renderMetricCard = (name: string, value: string | number, formula: string, change?: string, changeType?: "increase" | "decrease", previousValue?: string | number) => {
        const isPositive = changeType === "increase";
        const displayValue = typeof value === 'number' ? formatCurrency(value) : value;
        const displayPreviousValue = typeof previousValue === 'number' ? formatCurrency(previousValue) : previousValue;

        return (
            <div key={name} className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{name}</p>
                        {change && (
                            <span className={cn("flex items-center gap-1 text-xs font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
                                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {change}%
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold mt-1">{displayValue}</p>
                </div>
                <div className="mt-2 pt-2 border-t space-y-1 text-xs">
                    {change && previousValue !== undefined && (
                        <div className={cn("flex items-center gap-1 font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
                            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {change}% 
                            <p className="text-muted-foreground"> from {displayPreviousValue} {previousPeriodLabel}</p>
                        </div>
                    )}
                    <p className="text-muted-foreground pt-1">{formula}</p>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Financial Metrics</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowChart(!showChart)}>
                    {showChart ? <EyeOff className="mr-2 h-4 w-4" /> : <BarChart className="mr-2 h-4 w-4" />} {showChart ? "Hide Graph" : "Show Graph"}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-[180px] w-full" />)
                    ) : (
                        <>
                            {renderMetricCard(
                                "Total Revenue",
                                totalRevenueData?.value || 0,
                                "Sum of all income from services",
                                totalRevenueData?.change?.toFixed(1) || "0",
                                (totalRevenueData && totalRevenueData.change >= 0) ? "increase" : "decrease",
                                totalRevenueData?.previousValue || 0
                            )}
                            {otherFinancialMetrics.map((metric) => renderMetricCard(metric.name, metric.value, metric.formula, metric.change, metric.changeType, metric.previousValue))}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
