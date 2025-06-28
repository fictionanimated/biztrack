import React, { type ReactNode } from "react";

export interface Stat {
  icon: string;
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  description: ReactNode;
  progressValue?: number;
  className?: string;
}

export interface RecentOrder {
  id: string;
  clientName: string;
  clientEmail:string;
  amount: number;
}

export interface IncomeBySource {
  source: string;
  amount: number;
  fill: string;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
}

export interface TopClient {
  name: string;
  amount: number;
}

export interface DashboardData {
  stats: Stat[];
  revenueByDay: RevenueByDay[];
  incomeBySource: IncomeBySource[];
  recentOrders: RecentOrder[];
  aiInsights: string;
  topClients: TopClient[];
}

export const dashboardData: DashboardData = {
  stats: [
    {
      icon: "DollarSign",
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+2.5%",
      changeType: "increase",
      description: "vs. last month",
    },
    {
      icon: "CreditCard",
      title: "Total Expenses",
      value: "$10,543.00",
      change: "+7.1%",
      changeType: "increase",
      description: "vs. last month",
    },
    {
      icon: "TrendingUp",
      title: "Net Profit",
      value: "$34,688.89",
      change: "+1.2%",
      changeType: "increase",
      description: "vs. last month",
    },
    {
      icon: "Goal",
      title: "Target for June",
      value: "$50,000.00",
      description: "Monthly revenue goal",
    },
    {
      icon: "BarChart",
      title: "Performance vs Target",
      value: "90.5%",
      description: "Progress towards your goal",
      progressValue: 90.5,
    },
    {
      icon: "DollarSign",
      title: "Avg Daily Revenue (ADR)",
      value: "$1,507.73",
      description: "Based on current month's performance",
    },
    {
      icon: "DollarSign",
      title: "Req. Daily Revenue (RDR)",
      value: "$476.81",
      description: "To meet your monthly target",
    },
    {
      icon: "BarChart",
      title: "Avg Order Value (AOV)",
      value: "$131.50",
      change: "-3.2%",
      changeType: "decrease",
      description: "vs. last month",
    },
    {
      icon: "ShoppingCart",
      title: "Total Orders (Completed)",
      value: "344",
      change: "+12.5%",
      changeType: "increase",
      description: "vs. last month",
    },
    {
      icon: "Users",
      title: "Total Buyers",
      value: "344",
      description: React.createElement(
        "div",
        { className: "flex flex-wrap items-center gap-x-4" },
        React.createElement("span", { key: "new" }, "New: 227 (66%)"),
        React.createElement("span", { key: "repeat" }, "Repeat: 117 (34%)")
      ),
      className: "lg:col-span-2",
    },
    {
      icon: "Calendar",
      title: "Days Left in Month",
      value: "10",
      description: "in current billing cycle",
    },
    {
      icon: "XCircle",
      title: "Cancelled Orders",
      value: "12 ($1,432.10)",
      change: "+20%",
      changeType: "increase",
      description: "vs. last month",
    },
    {
      icon: "Star",
      title: "% Orders with Reviews",
      value: "45.8%",
      description: "of completed orders have a review",
    },
    {
      icon: "Users",
      title: "All-Time Total Buyers",
      value: "1,245",
      description: "SOB: 980 | Repeat: 265",
    },
  ],
  revenueByDay: [
    { date: "2024-05-01", revenue: 2000 },
    { date: "2024-05-02", revenue: 2200 },
    { date: "2024-05-03", revenue: 2500 },
    { date: "2024-05-04", revenue: 2100 },
    { date: "2024-05-05", revenue: 2800 },
    { date: "2024-05-06", revenue: 3000 },
    { date: "2024-05-07", revenue: 3200 },
    { date: "2024-05-08", revenue: 2900 },
    { date: "2024-05-09", revenue: 3500 },
    { date: "2024-05-10", revenue: 3700 },
    { date: "2024-05-11", revenue: 4000 },
    { date: "2024-05-12", revenue: 3800 },
    { date: "2024-05-13", revenue: 4200 },
    { date: "2024-05-14", revenue: 4500 },
    { date: "2024-05-15", revenue: 4300 },
  ],
  incomeBySource: [
    { source: "Web Design", amount: 15231, fill: "var(--color-chart-1)" },
    { source: "Consulting", amount: 10432, fill: "var(--color-chart-2)" },
    { source: "Logo Design", amount: 8900, fill: "var(--color-chart-3)" },
    { source: "SEO Services", amount: 6400, fill: "var(--color-chart-4)" },
    { source: "Maintenance", amount: 4268, fill: "var(--color-chart-5)" },
  ],
  recentOrders: [
    {
      id: "ORD001",
      clientName: "Olivia Martin",
      clientEmail: "olivia.martin@email.com",
      amount: 1999.0,
    },
    {
      id: "ORD002",
      clientName: "Jackson Lee",
      clientEmail: "jackson.lee@email.com",
      amount: 399.0,
    },
    {
      id: "ORD003",
      clientName: "Isabella Nguyen",
      clientEmail: "isabella.nguyen@email.com",
      amount: 299.0,
    },
    {
      id: "ORD004",
      clientName: "William Kim",
      clientEmail: "will@email.com",
      amount: 999.0,
    },
    {
      id: "ORD005",
      clientName: "Sofia Davis",
      clientEmail: "sofia.davis@email.com",
      amount: 499.0,
    },
  ],
  topClients: [
    { name: "Liam Johnson", amount: 4500 },
    { name: "Noah Williams", amount: 3200 },
    { name: "Olivia Martin", amount: 2800 },
    { name: "Emma Brown", amount: 2500 },
    { name: "Ava Jones", amount: 1900 },
  ],
  aiInsights:
    "Your revenue is trending positively, driven by Web Design services. Consider offering tiered packages for Consulting to increase average order value. Client acquisition is strong, but focus on strategies to improve the repeat client rate, such as loyalty discounts or follow-up services.",
};
