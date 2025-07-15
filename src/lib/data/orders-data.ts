import { z } from "zod";
import type { ObjectId } from "mongodb";

export const orderFormSchema = z.object({
  date: z.date({ required_error: "An order date is required." }),
  id: z.string().min(1, "Order ID is required."),
  username: z.string().min(1, "Username is required."),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  source: z.string().min(1, "Source is required."),
  gig: z.string().min(1, "Gig is required."),
  status: z.enum(["Completed", "In Progress", "Cancelled"]),
  rating: z.coerce.number().min(0, "Rating must be at least 0").max(5, "Rating cannot be more than 5").optional().nullable(),
  cancellationReasons: z.array(z.string()).optional(),
  customCancellationReason: z.string().optional(),
}).refine(data => {
    if (data.status === 'Cancelled') {
        return (data.cancellationReasons?.length ?? 0) > 0 || (data.customCancellationReason?.trim() ?? "") !== "";
    }
    return true;
}, {
    message: "At least one cancellation reason must be provided for cancelled orders.",
    path: ["cancellationReasons"],
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const cancellationReasonsList = [
    "Cancelled without requirements",
    "Expectations beyond requirements",
    "Not satisfied with design",
    "Not satisfied with animations",
    "Late delivery",
    "Unresponsive buyer",
];

export interface Order {
    _id?: ObjectId;
    id: string;
    clientUsername: string;
    date: string;
    amount: number;
    source: string;
    gig?: string;
    status: 'Completed' | 'In Progress' | 'Cancelled';
    rating?: number | null;
    cancellationReasons?: string[];
}
