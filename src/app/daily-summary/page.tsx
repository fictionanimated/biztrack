
"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CalendarView from "@/components/daily-summary/calendar-view";

export interface DailySummary {
  id: number;
  date: Date;
  content: string;
}

const initialSummaries: DailySummary[] = [
    { id: 1, date: new Date(2025, 5, 8), content: "Eid al-Adha Holiday" },
    { id: 2, date: new Date(2025, 5, 9), content: "Eid al-Adha Holiday" },
    { id: 3, date: new Date(2025, 5, 12), content: "Client meeting follow-up" },
    { id: 4, date: new Date(2025, 5, 20), content: "Finalize Q3 marketing plan. It needs to be perfect." },
    { id: 5, date: new Date(2025, 5, 20), content: "Review developer applications" },
];

const summaryFormSchema = z.object({
  content: z.string().min(3, { message: "Summary must be at least 3 characters." }),
});

type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export default function DailySummaryPage() {
  const [summaries, setSummaries] = useState<DailySummary[]>(initialSummaries);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingSummary, setEditingSummary] = useState<DailySummary | null>(null);
  const [deletingSummary, setDeletingSummary] = useState<DailySummary | null>(null);
  const { toast } = useToast();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
  });

  const handleDateClick = (date: Date) => {
    setEditingSummary(null);
    setSelectedDate(date);
    form.reset({ content: "" });
    setDialogOpen(true);
  };
  
  const handleSummaryClick = (summary: DailySummary) => {
    setEditingSummary(summary);
    setSelectedDate(summary.date);
    form.reset({ content: summary.content });
    setDialogOpen(true);
  }

  const onSubmit = (values: SummaryFormValues) => {
    if (!selectedDate) return;

    if (editingSummary) {
      const updatedSummary = { ...editingSummary, content: values.content };
      setSummaries(summaries.map(s => s.id === editingSummary.id ? updatedSummary : s));
      toast({ title: "Summary Updated" });
    } else {
      const newSummary: DailySummary = {
        id: Date.now(),
        date: selectedDate,
        content: values.content,
      };
      setSummaries([...summaries, newSummary]);
      toast({ title: "Summary Added" });
    }

    setDialogOpen(false);
    setEditingSummary(null);
    setSelectedDate(null);
  };
  
  const handleDelete = () => {
    if (!editingSummary) return;
    setSummaries(summaries.filter(s => s.id !== editingSummary.id));
    toast({ title: "Summary Deleted" });
    setDeletingSummary(null);
    setDialogOpen(false);
    setEditingSummary(null);
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(startOfMonth(new Date()));
  }

  const dialogTitle = useMemo(() => {
    if (editingSummary) return `Edit Summary for ${format(editingSummary.date, 'PPP')}`;
    if (selectedDate) return `Add Summary for ${format(selectedDate, 'PPP')}`;
    return "Summary";
  }, [editingSummary, selectedDate]);


  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
            <h1 className="font-headline text-xl font-semibold md:text-2xl">
                Calendar
            </h1>
            <Button variant="outline" onClick={handleToday}>Today</Button>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Previous month">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Next month">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        </div>
      </header>
      
      <main className="flex flex-1 overflow-auto">
        <CalendarView 
            currentDate={currentDate}
            summaries={summaries}
            onDateClick={handleDateClick}
            onSummaryClick={handleSummaryClick}
        />
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Write your summary here..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="sm:justify-between">
                <div>
                  {editingSummary && (
                    <Button type="button" variant="destructive" onClick={() => {
                        setDeletingSummary(editingSummary)
                    }}>
                        Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">{editingSummary ? 'Save Changes' : 'Save Summary'}</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingSummary} onOpenChange={(open) => {if (!open) setDeletingSummary(null)}}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete this summary.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
