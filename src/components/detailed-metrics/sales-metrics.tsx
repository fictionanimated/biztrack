
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const salesMetrics = [
    { name: "Lead Conversion Rate (%)", value: "18.5%", formula: "(Number of Sales / Number of Leads) × 100" },
    { name: "Quote-to-Close Ratio (%)", value: "65%", formula: "(Accepted Proposals / Total Proposals Sent) × 100" },
    { name: "Win Rate (%)", value: "75%", formula: "(Deals Closed / Total Opportunities) × 100" },
    { name: "Response Time", value: "1.2 hours", formula: "Average time taken to reply to inquiries" },
];

export function SalesMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span>Sales & Conversion Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesMetrics.map((metric) => (
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
