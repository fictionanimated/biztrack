
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

const marketingMetrics = [
    { name: "Cost per Lead (CPL)", value: "$25.50", formula: "Total Marketing Spend / Number of Leads Generated" },
    { name: "Marketing ROI (ROMI)", value: "450%", formula: "((Revenue from Marketing - Marketing Cost) / Marketing Cost) × 100" },
    { name: "Engagement Rate", value: "3.5%", formula: "((Likes + Comments + Shares) / Followers) × 100" },
    { name: "Conversion Rate (from traffic)", value: "1.8%", formula: "(Number of Clients / Website Visitors) × 100" },
];

export function MarketingMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <span>Marketing Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketingMetrics.map((metric) => (
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
