
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const financialMetrics = [
  { name: "Total Revenue", value: "$45,231.89", formula: "Sum of all income from services" },
  { name: "Total Expenses", value: "$10,543.00", formula: "Sum of all business expenses" },
  { name: "Net Profit", value: "$34,688.89", formula: "Total Revenue - Total Expenses" },
  { name: "Profit Margin (%)", value: "76.7%", formula: "(Net Profit / Total Revenue) × 100" },
  { name: "Gross Margin (%)", value: "85.2%", formula: "((Revenue - Cost of Services Sold) / Revenue) × 100" },
  { name: "Client Acquisition Cost (CAC)", value: "$150.25", formula: "Total Sales & Marketing Costs / Number of New Clients" },
  { name: "Customer Lifetime Value (CLTV)", value: "$2,540.75", formula: "AOV × Repeat Purchase Rate × Avg. Client Lifespan" },
  { name: "Average Order Value (AOV)", value: "$131.50", formula: "Total Revenue / Number of Orders" },
  { name: "Outstanding Receivables", value: "$5,210.00", formula: "Sum of all unpaid invoices or pending payments" },
];

export function FinancialMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <span>Financial Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialMetrics.map((metric) => (
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
