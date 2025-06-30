
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const clientMetrics = [
    { name: "Client Retention Rate (%)", value: "85%", formula: "((Clients End - New Clients) / Clients Start) × 100" },
    { name: "Repeat Purchase Rate (%)", value: "34%", formula: "(Number of Repeat Clients / Total Clients) × 100" },
    { name: "Client Satisfaction (CSAT)", value: "92%", formula: "(Sum of all Client Ratings / Number of Responses) × 100" },
    { name: "Net Promoter Score (NPS)", value: "+54", formula: "% Promoters - % Detractors (from survey)" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientMetrics.map((metric) => (
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
