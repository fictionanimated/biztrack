
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  Megaphone,
  Clock,
  Briefcase,
  BarChart,
  type LucideIcon,
} from "lucide-react";

interface Metric {
  name: string;
  value: string;
  formula: string;
}

interface MetricCategory {
  title: string;
  icon: LucideIcon;
  metrics: Metric[];
}

const metricsCategories: MetricCategory[] = [
  {
    title: "Financial Metrics",
    icon: DollarSign,
    metrics: [
      { name: "Total Revenue", value: "$45,231.89", formula: "Sum of all income from services" },
      { name: "Net Profit", value: "$34,688.89", formula: "Total Revenue - Total Expenses" },
      { name: "Profit Margin (%)", value: "76.7%", formula: "(Net Profit / Total Revenue) × 100" },
      { name: "Gross Margin (%)", value: "85.2%", formula: "((Revenue - Cost of Services Sold) / Revenue) × 100" },
      { name: "Client Acquisition Cost (CAC)", value: "$150.25", formula: "Total Sales & Marketing Costs / Number of New Clients" },
      { name: "Customer Lifetime Value (CLTV)", value: "$2,540.75", formula: "AOV × Repeat Purchase Rate × Avg. Client Lifespan" },
      { name: "Cash Flow", value: "$12,345.00", formula: "Cash Inflows - Cash Outflows" },
      { name: "Average Order Value (AOV)", value: "$131.50", formula: "Total Revenue / Number of Orders" },
      { name: "Outstanding Receivables", value: "$5,210.00", formula: "Sum of all unpaid invoices or pending payments" },
    ],
  },
  {
    title: "Client Metrics",
    icon: Users,
    metrics: [
      { name: "Client Retention Rate (%)", value: "85%", formula: "((Clients End - New Clients) / Clients Start) × 100" },
      { name: "Repeat Purchase Rate (%)", value: "34%", formula: "(Number of Repeat Clients / Total Clients) × 100" },
      { name: "Client Satisfaction (CSAT)", value: "92%", formula: "(Sum of all Client Ratings / Number of Responses) × 100" },
      { name: "Net Promoter Score (NPS)", value: "+54", formula: "% Promoters - % Detractors (from survey)" },
    ],
  },
  {
    title: "Sales & Conversion Metrics",
    icon: TrendingUp,
    metrics: [
      { name: "Lead Conversion Rate (%)", value: "18.5%", formula: "(Number of Sales / Number of Leads) × 100" },
      { name: "Quote-to-Close Ratio (%)", value: "65%", formula: "(Accepted Proposals / Total Proposals Sent) × 100" },
      { name: "Win Rate (%)", value: "75%", formula: "(Deals Closed / Total Opportunities) × 100" },
      { name: "Response Time", value: "1.2 hours", formula: "Average time taken to reply to inquiries" },
    ],
  },
  {
    title: "Marketing Metrics",
    icon: Megaphone,
    metrics: [
      { name: "Cost per Lead (CPL)", value: "$25.50", formula: "Total Marketing Spend / Number of Leads Generated" },
      { name: "Marketing ROI (ROMI)", value: "450%", formula: "((Revenue from Marketing - Marketing Cost) / Marketing Cost) × 100" },
      { name: "Engagement Rate", value: "3.5%", formula: "((Likes + Comments + Shares) / Followers) × 100" },
      { name: "Conversion Rate (from traffic)", value: "1.8%", formula: "(Number of Clients / Website Visitors) × 100" },
    ],
  },
  {
    title: "Project & Delivery Metrics",
    icon: Clock,
    metrics: [
      { name: "Average Project Delivery Time", value: "12 days", formula: "Sum of all Delivery Times / Total Projects Delivered" },
      { name: "Revisions per Project", value: "1.8", formula: "Total Number of Revisions / Total Projects Delivered" },
      { name: "Utilization Rate (%)", value: "88%", formula: "(Billable Hours / Total Work Hours Available) × 100" },
      { name: "Task Completion Rate (%)", value: "96%", formula: "(Completed Tasks / Total Tasks Assigned) × 100" },
    ],
  },
  {
    title: "Team & Operations",
    icon: Briefcase,
    metrics: [
      { name: "Employee Turnover Rate (%)", value: "5%", formula: "(Employees Left / Total Employees) × 100" },
      { name: "Internal Training Time", value: "8 hours/month", formula: "Total Training Hours / Team Members" },
      { name: "Team Efficiency Score", value: "92%", formula: "Tasks Completed on Time / Total Tasks" },
    ],
  },
  {
    title: "Growth Metrics",
    icon: BarChart,
    metrics: [
      { name: "Monthly Revenue Growth (%)", value: "2.5%", formula: "((This Month’s Revenue - Last Month’s Revenue) / Last Month’s Revenue) × 100" },
      { name: "Client Growth Rate (%)", value: "10%", formula: "((New Clients - Lost Clients) / Clients Last Month) × 100" },
      { name: "Referral Growth Rate", value: "15%", formula: "(Referral Clients / Total New Clients) × 100" },
    ],
  },
];

export default function DetailedMetricsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Detailed Metrics
        </h1>
      </div>

      <div className="space-y-8">
        {metricsCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-6 w-6 text-primary" />
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Metric</TableHead>
                    <TableHead className="w-[15%]">Value</TableHead>
                    <TableHead>Formula</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.metrics.map((metric) => (
                    <TableRow key={metric.name}>
                      <TableCell className="font-medium">{metric.name}</TableCell>
                      <TableCell className="font-mono text-base">{metric.value}</TableCell>
                      <TableCell className="text-muted-foreground">{metric.formula}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
