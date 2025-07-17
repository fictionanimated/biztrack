import { z } from "zod";
import type { ObjectId } from "mongodb";

export const summaryFormSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  content: z.string().min(3, { message: "Summary must be at least 3 characters." }),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export interface DailySummary {
  _id: ObjectId;
  id: string;
  date: string;
  content: string;
}

export const initialSummaries: Omit<DailySummary, 'id' | '_id'>[] = [
    { date: "2024-05-20", content: "Finalized Q3 marketing plan. Key focus on social media engagement and influencer outreach." },
    { date: "2024-05-18", content: "Client 'Innovate Web' project milestone 2 completed ahead of schedule. Team did a great job." },
    { date: "2024-05-15", content: "Team meeting to discuss performance. Need to improve our lead conversion rate for consulting services." },
];
