
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import type { IncomeSource } from "@/lib/data/incomes-data";

const editSourceFormSchema = z.object({
    name: z.string().min(2, { message: "Source name must be at least 2 characters." }),
});
type EditSourceFormValues = z.infer<typeof editSourceFormSchema>;

interface EditSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingSource: IncomeSource | null;
    onSourceUpdated: (updatedSource: IncomeSource) => void;
}

export function EditSourceDialog({ open, onOpenChange, editingSource, onSourceUpdated }: EditSourceDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<EditSourceFormValues>({
        resolver: zodResolver(editSourceFormSchema),
    });

    useEffect(() => {
        if (editingSource) {
            form.reset({
                name: editingSource.name,
            });
        }
    }, [editingSource, form]);

    async function onSubmit(values: EditSourceFormValues) {
        if (!editingSource) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/incomes/${editingSource.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: values.name }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update income source');
            }
            
            onSourceUpdated(result);
            toast({
                title: "Source Updated",
                description: `Income source renamed to "${values.name}".`,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: (error as Error).message || "Could not update the source. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Income Source</DialogTitle>
                    <DialogDescription>
                       Update the name for &quot;{editingSource?.name}&quot;. This will also update all associated orders.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
