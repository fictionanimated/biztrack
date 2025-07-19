
"use client";

import { memo } from "react";
import { OrdersDashboard } from "@/components/orders/orders-dashboard";

const OrdersPageComponent = () => {
  return <OrdersDashboard />;
};

const MemoizedOrdersPage = memo(OrdersPageComponent);

export default function OrdersPage() {
  return <MemoizedOrdersPage />;
}
