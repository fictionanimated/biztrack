

import { type BusinessNote } from "./business-notes-data";

export interface CompetitorYearlyData {
    id: string;
    name: string;
    monthlyOrders: number[];
    totalOrders: number;
}

export interface MonthlyFinancials {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    monthlyTargetRevenue: number;
    notes: Pick<BusinessNote, 'title' | 'content' | 'date'>[];
}

export interface SingleYearData {
    year: number;
    myTotalYearlyOrders: number;
    monthlyOrders: number[];
    competitors: CompetitorYearlyData[];
    monthlyFinancials: MonthlyFinancials[];
}

export interface YearlyStatsData {
    [year: number]: SingleYearData;
}

    
