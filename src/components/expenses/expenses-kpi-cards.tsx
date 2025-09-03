
"use client";

import StatCard from "@/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ExpensesKpiCardsProps {
    totalExpenses: number;
    totalExpensesChange: { value: string; type: "increase" | "decrease" } | null;
    avgDailyBurn: number;
    avgDailyBurnChange: { value: string; type: "increase" | "decrease" } | null;
    avgMonthlyExpense: number;
    avgMonthlyExpenseChange: { value: string; type: "increase" | "decrease" } | null;
    previousPeriodDescription: string;
    topSpendingCategory: { name: string; amount: number };
}

export function ExpensesKpiCards({
    totalExpenses,
    totalExpensesChange,
    avgDailyBurn,
    avgDailyBurnChange,
    avgMonthlyExpense,
    avgMonthlyExpenseChange,
    previousPeriodDescription,
    topSpendingCategory,
}: ExpensesKpiCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                    <CardDescription>Total for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
                    {totalExpensesChange && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className={cn(
                                "flex items-center gap-1 font-medium",
                                totalExpensesChange.type === 'increase' ? 'text-red-600' : 'text-green-600'
                            )}>
                                {totalExpensesChange.type === 'increase' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {totalExpensesChange.value}%
                            </span>
                            <span className="ml-1">{previousPeriodDescription}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Avg. Daily Burn</CardTitle>
                    <CardDescription>Average daily cost to run the business.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">${avgDailyBurn.toFixed(2)}</p>
                    {avgDailyBurnChange && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className={cn(
                                "flex items-center gap-1 font-medium",
                                avgDailyBurnChange.type === 'increase' ? 'text-red-600' : 'text-green-600'
                            )}>
                                {avgDailyBurnChange.type === 'increase' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {avgDailyBurnChange.value}%
                            </span>
                            <span className="ml-1">{previousPeriodDescription}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Avg. Monthly Expense</CardTitle>
                    <CardDescription>Average monthly cost in period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">${avgMonthlyExpense.toFixed(2)}</p>
                     {avgMonthlyExpenseChange && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className={cn(
                                "flex items-center gap-1 font-medium",
                                avgMonthlyExpenseChange.type === 'increase' ? 'text-red-600' : 'text-green-600'
                            )}>
                                {avgMonthlyExpenseChange.type === 'increase' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {avgMonthlyExpenseChange.value}%
                            </span>
                            <span className="ml-1">{previousPeriodDescription}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Top Spending Category</CardTitle>
                    <CardDescription>{topSpendingCategory.name}</CardDescription>
                </CardHeader>
                 <CardContent>
                    <p className="text-4xl font-bold">${topSpendingCategory.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">of total expenses in period</p>
                </CardContent>
            </Card>
        </div>
    );
}
