
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const growthMetrics = [
    { name: "Monthly Revenue Growth (%)", value: "2.5%", formula: "((This Month’s Revenue - Last Month’s Revenue) / Last Month’s Revenue) × 100" },
    { name: "Client Growth Rate (%)", value: "10%", formula: "((New Clients - Lost Clients) / Clients Last Month) × 100" },
    { name: "Referral Growth Rate", value: "15%", formula: "(Referral Clients / Total New Clients) × 100" },
];

export function GrowthMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-6 w-6 text-primary" />
          <span>Growth Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {growthMetrics.map((metric) => (
            <div key={metric.name} className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">{metric.formula}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
