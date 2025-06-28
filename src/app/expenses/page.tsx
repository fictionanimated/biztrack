"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateFilter } from "@/components/dashboard/date-filter";

const expenses = [
    { id: "1", date: "2024-05-01", type: "Software Subscription", amount: 49.99 },
    { id: "2", date: "2024-05-05", type: "Office Supplies", amount: 125.50 },
    { id: "3", date: "2024-05-10", type: "Marketing Campaign", amount: 500.00 },
    { id: "4", date: "2024-05-15", type: "Cloud Hosting", amount: 75.00 },
    { id: "5", date: "2024-05-20", type: "Freelancer Payment", amount: 1200.00 },
    { id: "6", date: "2024-04-15", type: "Office Supplies", amount: 80.00 },
    { id: "7", date: "2024-04-25", type: "Travel", amount: 350.00 },
    { id: "8", date: "2023-12-20", type: "Freelancer Payment", amount: 1500.00 },
    { id: "9", date: "2023-12-05", type: "Cloud Hosting", amount: 75.00 },
    { id: "10", date: "2022-01-10", type: "Software Subscription", amount: 49.99 },
];


export default function ExpensesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      
      const from = date?.from;
      const to = date?.to;

      if (from && expenseDate < from) {
        return false;
      }
      if (to) {
        const toDateEnd = new Date(to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (expenseDate > toDateEnd) {
          return false;
        }
      }
      
      return true;
    });
  }, [date]);

  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Expenses
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <DateFilter date={date} setDate={setDate} />
          <Button>Add New Expense</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle>Manage Expenses</CardTitle>
            <CardDescription>
                Track and manage all your business expenses.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{expense.type}</TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">No expenses found for the selected period.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>Total for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
