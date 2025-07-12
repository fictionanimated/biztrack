
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
}

export interface SingleYearData {
    year: number;
    myTotalYearlyOrders: number;
    monthlyOrders: number[];
    competitors: CompetitorYearlyData[];
    monthlyFinancials: MonthlyFinancials[];
    monthlyTargetRevenue: number[];
}

export interface YearlyStatsData {
    [year: number]: SingleYearData;
}

const generateCompetitorData = (baseOrders: number[]): { monthlyOrders: number[], totalOrders: number } => {
    const monthlyOrders = baseOrders.map(o => Math.max(20, Math.round(o * (0.8 + Math.random() * 0.4))));
    const totalOrders = monthlyOrders.reduce((sum, current) => sum + current, 0);
    return { monthlyOrders, totalOrders };
};

const generateFinancialData = (baseRevenue: number[]): { monthlyFinancials: MonthlyFinancials[], monthlyTargetRevenue: number[] } => {
    const monthlyFinancials = baseRevenue.map((rev, i) => {
        const expenses = Math.round(rev * (0.4 + Math.random() * 0.3));
        const profit = rev - expenses;
        return {
            month: new Date(0, i).toLocaleString('default', { month: 'short' }),
            revenue: rev,
            expenses,
            profit,
        }
    });
    const monthlyTargetRevenue = baseRevenue.map(rev => Math.round(rev * 0.9));
    return { monthlyFinancials, monthlyTargetRevenue };
};

const myOrders2022 = [65, 70, 85, 90, 105, 120, 110, 130, 145, 155, 170, 190];
const myOrders2023 = [80, 95, 110, 120, 135, 150, 140, 160, 175, 185, 200, 220];
const myOrders2024 = [100, 115, 130, 145, 160, 175, 165, 185, 200, 215, 230, 250];
const myOrders2025 = [120, 135, 150, 165, 180, 195, 185, 205, 220, 235, 250, 270];

const myFinancials2023 = generateFinancialData([15000, 17500, 20000, 22000, 25000, 28000, 26000, 30000, 32000, 35000, 38000, 42000]);

export const yearlyStatsData: YearlyStatsData = {
    2022: {
        year: 2022,
        myTotalYearlyOrders: myOrders2022.reduce((s, c) => s + c, 0),
        monthlyOrders: myOrders2022,
        competitors: [
            { id: 'comp1-2022', name: 'Creative Solutions Inc.', ...generateCompetitorData(myOrders2022) },
            { id: 'comp2-2022', name: 'Digital Masters Co.', ...generateCompetitorData(myOrders2022) },
            { id: 'comp3-2022', name: 'Innovate Web Agency', ...generateCompetitorData(myOrders2022) },
        ],
        ...generateFinancialData(myOrders2022.map(o => o * 180)),
    },
    2023: {
        year: 2023,
        myTotalYearlyOrders: myOrders2023.reduce((s, c) => s + c, 0),
        monthlyOrders: myOrders2023,
        competitors: [
            { id: 'comp1-2023', name: 'Creative Solutions Inc.', monthlyOrders: [70, 80, 90, 100, 110, 120, 115, 125, 135, 145, 155, 165], totalOrders: 1410 },
            { id: 'comp2-2023', name: 'Digital Masters Co.', monthlyOrders: [60, 75, 85, 95, 105, 115, 110, 120, 130, 140, 150, 160], totalOrders: 1345 },
            { id: 'comp3-2023', name: 'Innovate Web Agency', monthlyOrders: [90, 105, 120, 130, 145, 160, 150, 170, 185, 195, 210, 230], totalOrders: 1890 },
        ],
        ...myFinancials2023,
    },
    2024: {
        year: 2024,
        myTotalYearlyOrders: myOrders2024.reduce((s, c) => s + c, 0),
        monthlyOrders: myOrders2024,
        competitors: [
            { id: 'comp1-2024', name: 'Creative Solutions Inc.', ...generateCompetitorData(myOrders2024) },
            { id: 'comp2-2024', name: 'Digital Masters Co.', ...generateCompetitorData(myOrders2024) },
            { id: 'comp3-2024', name: 'Innovate Web Agency', ...generateCompetitorData(myOrders2024) },
        ],
        ...generateFinancialData(myOrders2024.map(o => o * 220)),
    },
     2025: {
        year: 2025,
        myTotalYearlyOrders: myOrders2025.reduce((s, c) => s + c, 0),
        monthlyOrders: myOrders2025,
        competitors: [
            { id: 'comp1-2025', name: 'Creative Solutions Inc.', ...generateCompetitorData(myOrders2025) },
            { id: 'comp2-2025', name: 'Digital Masters Co.', ...generateCompetitorData(myOrders2025) },
            { id: 'comp3-2025', name: 'Innovate Web Agency', ...generateCompetitorData(myOrders2025) },
        ],
        ...generateFinancialData(myOrders2025.map(o => o * 250)),
    },
};
