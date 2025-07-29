
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardData } from "@/lib/placeholder-data";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getSettings } from "@/lib/services/settingsService";

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

  const settings = await getSettings();

  return (
    <DashboardClient
      stats={stats}
      revenueByDay={revenueByDay}
      previousRevenueByDay={previousRevenueByDay}
      recentOrders={recentOrders}
      aiInsights={aiInsights}
      topClients={topClients}
      incomeBySource={incomeBySource}
      initialMonthlyTargets={settings.monthlyTargets || {}}
    />
  );
}
