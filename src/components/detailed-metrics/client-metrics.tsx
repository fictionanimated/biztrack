
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const clientMetrics = [
    { name: "Total Clients", value: "125", formula: "Total unique clients in period", change: "+15", changeType: "increase" as const },
    { name: "New Clients", value: "30", formula: "Clients with their first order in period", change: "+5", changeType: "increase" as const },
    { name: "Repeat Orders", value: "95", formula: "Orders from existing clients", change: "+12%", changeType: "increase" as const },
    { name: "Client Retention Rate (%)", value: "85%", formula: "((End Clients - New) / Start Clients) × 100", change: "+2.0%", changeType: "increase" as const },
    { name: "Repeat Purchase Rate (%)", value: "34%", formula: "(Repeat Clients / Total Clients) × 100", change: "-1.5%", changeType: "decrease" as const },
    { name: "Client Satisfaction (CSAT)", value: "92%", formula: "(Positive Ratings / Total Ratings) × 100", change: "+3.0%", changeType: "increase" as const },
    { name: "Average Rating", value: "4.8 / 5.0", formula: "Sum of ratings / Number of rated orders", change: "+0.1", changeType: "increase" as const },
];

export function ClientMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <span>Client Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientMetrics.map((metric) => {
            const isPositive = metric.changeType === "increase";
            return (
                <div key={metric.name} className="rounded-lg border bg-background/50 p-4 flex flex-col justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <div className="mt-2 pt-2 border-t space-y-1">
                    {metric.change && (
                        <div className="flex items-center text-xs">
                            <span
                                className={cn(
                                    "flex items-center gap-1 font-semibold",
                                    isPositive ? "text-green-600" : "text-red-600"
                                )}
                            >
                                {metric.changeType === "increase" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {metric.change}
                            </span>
                            <span className="ml-1 text-muted-foreground">vs selected period</span>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">{metric.formula}</p>
                </div>
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
