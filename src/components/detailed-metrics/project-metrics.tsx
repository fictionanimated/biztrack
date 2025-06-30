
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const projectMetrics = [
    { name: "Average Project Delivery Time", value: "12 days", formula: "Sum of all Delivery Times / Total Projects Delivered" },
    { name: "Revisions per Project", value: "1.8", formula: "Total Number of Revisions / Total Projects Delivered" },
    { name: "Utilization Rate (%)", value: "88%", formula: "(Billable Hours / Total Work Hours Available) × 100" },
    { name: "Task Completion Rate (%)", value: "96%", formula: "(Completed Tasks / Total Tasks Assigned) × 100" },
];

export function ProjectMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <span>Project & Delivery Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectMetrics.map((metric) => (
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
