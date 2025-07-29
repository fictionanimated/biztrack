
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardData } from "@/lib/placeholder-data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getMonthlyTargets } from "@/lib/services/monthlyTargetsService";

export default async function DashboardPage() {
  const {
    stats,
    revenueByDay,
    previousRevenueByDay,
    recentOrders,
    aiInsights,
    topClients,
    incomeBySource,
  } = dashboardData;

  const monthlyTargets = await getMonthlyTargets();

  return (
    <DashboardClient
      stats={stats}
      revenueByDay={revenueByDay}
      previousRevenueByDay={previousRevenueByDay}
      recentOrders={recentOrders}
      aiInsights={aiInsights}
      topClients={topClients}
      incomeBySource={incomeBySource}
      initialMonthlyTargets={monthlyTargets}
    />
  );
}
