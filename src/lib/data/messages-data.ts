
import { z } from "zod";
import type { ObjectId } from "mongodb";

export const addMessageDataSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    messages: z.coerce.number().int().min(0, { message: "Number of messages must be a non-negative number." }),
    sourceId: z.string().min(1, { message: "Source ID is required." }),
});

export type AddMessageDataFormValues = z.infer<typeof addMessageDataSchema>;

export interface MessageData {
  _id: ObjectId;
  id: string;
  sourceId: string;
  date: string; // YYYY-MM-DD
  messages: number;
}
