
import { z } from "zod";
import type { ObjectId } from "mongodb";

export const summaryFormSchema = z.object({
  content: z.string().min(3, { message: "Summary must be at least 3 characters." }),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export interface DailySummary {
  _id: ObjectId;
  id: string;
  date: Date;
  content: string;
}

export const initialSummaries: Omit<DailySummary, 'id' | '_id'>[] = [
    { date: new Date("2024-07-20T00:00:00.000Z"), content: "Finalized Q3 marketing plan. Key focus on social media engagement and influencer outreach." },
    { date: new Date("2024-07-18T00:00:00.000Z"), content: "Client 'Innovate Web' project milestone 2 completed ahead of schedule. Team did a great job." },
    { date: new Date("2024-07-15T00:00:00.000Z"), content: "Team meeting to discuss performance. Need to improve our lead conversion rate for consulting services." },
];
