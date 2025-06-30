
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const teamMetrics = [
    { name: "Employee Turnover Rate (%)", value: "5%", formula: "(Employees Left / Total Employees) × 100" },
    { name: "Internal Training Time", value: "8 hours/month", formula: "Total Training Hours / Team Members" },
    { name: "Team Efficiency Score", value: "92%", formula: "Tasks Completed on Time / Total Tasks" },
];

export function TeamMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span>Team & Operations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMetrics.map((metric) => (
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
