
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { incomeSources, socialPlatforms, clientFormSchema, type ClientFormValues, type Client } from "@/lib/data/clients-data";

interface EditClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClientUpdated: (client: Client) => void;
    client: Client;
    children?: React.ReactNode;
}

export function EditClientDialog({ open, onOpenChange, onClientUpdated, client, children }: EditClientDialogProps) {
    const { toast } = useToast();

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            username: client.username,
            name: client.name || "",
            email: client.email || "",
            source: client.source,
            socialLinks: client.socialLinks || [],
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                username: client.username,
                name: client.name || "",
                email: client.email || "",
                source: client.source,
                socialLinks: client.socialLinks || [],
            });
        }
    }, [open, client, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "socialLinks",
    });

    function onSubmit(values: ClientFormValues) {
        const updatedClient: Client = {
            ...client,
            ...values,
        };
        onClientUpdated(updatedClient);
        toast({
            title: "Client Updated",
            description: `${values.name || values.username} has been updated.`,
        });
        onOpenChange(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription>
                        Update the details for {client.name || client.username}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., johndoe99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Client Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="e.g., john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Income Source</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an income source" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {incomeSources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div>
                            <FormLabel>Social Links (Optional)</FormLabel>
                            <div className="mt-2 space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-end gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`socialLinks.${index}.platform`}
                                            render={({ field }) => (
                                                <FormItem className="w-1/3">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Platform" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {socialPlatforms.map(p => {
                                                                const Icon = p.icon;
                                                                return (
                                                                    <SelectItem key={p.value} value={p.value}>
                                                                        <div className="flex items-center gap-2">
                                                                            <Icon className="h-4 w-4" />
                                                                            <span>{p.value}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`socialLinks.${index}.url`}
                                            render={({ field }) => (
                                                <FormItem className="flex-grow">
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove Link</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                             <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => append({ platform: "", url: "" })}
                                >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Social Link
                            </Button>
                        </div>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
