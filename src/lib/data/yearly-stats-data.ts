
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

    