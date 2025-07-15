
"use client";

import { memo } from "react";
import { IncomesDashboard } from "@/components/incomes/incomes-dashboard";

const IncomesPageComponent = () => {
  return <IncomesDashboard />;
};

const MemoizedIncomesPage = memo(IncomesPageComponent);

export default function IncomesPage() {
  return <MemoizedIncomesPage />;
}
