
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { formSchema as incomesFormSchema, type IncomeSource } from "@/lib/data/incomes-data";

interface AddSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSourceAdded: (newSource: IncomeSource) => void;
}

export function AddSourceDialog({ open, onOpenChange, onSourceAdded }: AddSourceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof incomesFormSchema>>({
    resolver: zodResolver(incomesFormSchema),
    defaultValues: {
      sourceName: "",
      gigs: [{ name: "", date: new Date() }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gigs",
  });
  
  async function onSubmit(values: z.infer<typeof incomesFormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to add income source');
      }

      const { source: newSource } = await response.json();
      onSourceAdded(newSource);
      
      toast({
        title: "Success",
        description: `Added new source: ${newSource.name}.`,
      });
      form.reset({
        sourceName: "",
        gigs: [{ name: "", date: new Date() }],
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save the new income source. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Income Source</DialogTitle>
          <DialogDescription>
            Enter the details for your new income source, including any
            specific gigs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="sourceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Gigs</FormLabel>
              <div className="mt-2 space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                      <FormField
                        control={form.control}
                        name={`gigs.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gig Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Acme Corp Website"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`gigs.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gig Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value &&
                                        "text-muted-foreground"
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Gig</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ name: "", date: new Date() })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add another Gig
              </Button>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Saving..." : "Save Source"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
