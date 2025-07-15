
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Gig } from "@/lib/data/incomes-data";

const addGigDataFormSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    impressions: z.coerce.number().int().min(0, { message: "Impressions must be a non-negative number." }),
    clicks: z.coerce.number().int().min(0, { message: "Clicks must be a non-negative number." }),
});
type AddGigDataFormValues = z.infer<typeof addGigDataFormSchema>;

interface AddGigDataDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    updatingGigInfo: { sourceId: string; gigId: string };
    onGigDataAdded: (updatedGig: Gig, sourceId: string) => void;
}

export function AddGigDataDialog({ open, onOpenChange, updatingGigInfo, onGigDataAdded }: AddGigDataDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<AddGigDataFormValues>({
        resolver: zodResolver(addGigDataFormSchema),
        defaultValues: {
            date: new Date(),
            impressions: 0,
            clicks: 0,
        },
    });

    async function onSubmit(values: AddGigDataFormValues) {
        if (!updatingGigInfo) return;
        setIsSubmitting(true);
        const { sourceId, gigId } = updatingGigInfo;

        try {
            const response = await fetch(`/api/incomes/${sourceId}/gigs/${gigId}/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to add analytics data');
            }
            
            const { gig: updatedGig } = await response.json();
            onGigDataAdded(updatedGig, sourceId);
            
            toast({
                title: "Analytics Data Added",
                description: `New performance data added for the gig.`,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not add performance data. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add Gig Performance Data</DialogTitle>
                    <DialogDescription>
                        Enter the performance metrics for this gig on a specific date.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="impressions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Impressions</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="e.g., 12450" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clicks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clicks</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="e.g., 980" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Add Data
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
