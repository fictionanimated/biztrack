
import { z } from "zod";
import type { ObjectId } from "mongodb";

export interface CompetitorMonthlyData {
  month: number;
  year: number;
  orders: number;
  reviews: number;
}

export interface Competitor {
  _id: ObjectId;
  id: string;
  name: string;
  username?: string;
  profileLink?: string;
  pricingStart?: number;
  pricingMid?: number;
  pricingTop?: number;
  reviewsCount?: number;
  totalOrders?: number;
  workingSince?: Date;
  notes?: string;
  monthlyData?: CompetitorMonthlyData[];
}

export const competitorFormSchema = z.object({
  name: z.string().min(2, { message: "Competitor name is required." }),
  username: z.string().optional(),
  profileLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  pricingStart: z.coerce.number().min(0, "Price must be a positive number.").optional(),
  pricingMid: z.coerce.number().min(0, "Price must be a positive number.").optional(),
  pricingTop: z.coerce.number().min(0, "Price must be a positive number.").optional(),
  reviewsCount: z.coerce.number().int("Number of reviews must be a whole number.").min(0).optional(),
  totalOrders: z.coerce.number().int("Number of orders must be a whole number.").min(0).optional(),
  workingSince: z.date().optional(),
  notes: z.string().optional(),
});

export type CompetitorFormValues = z.infer<typeof competitorFormSchema>;

export const competitorDataFormSchema = z.object({
  month: z.string().min(1, { message: "Month is required." }),
  year: z.string().min(1, { message: "Year is required." }),
  orders: z.coerce.number().int().min(0, "Orders must be a non-negative number."),
  reviews: z.coerce.number().int().min(0, "Reviews must be a non-negative number."),
});

export type CompetitorDataFormValues = z.infer<typeof competitorDataFormSchema>;


export const initialCompetitorsData: Omit<Competitor, 'id' | '_id' | 'workingSince' | 'monthlyData'> & { workingSince?: string; monthlyData: CompetitorMonthlyData[] }[] = [
    { name: "Creative Solutions Inc.", username: "creativeinc", profileLink: "https://example.com", pricingStart: 500, pricingMid: 1500, pricingTop: 5000, reviewsCount: 250, totalOrders: 300, workingSince: "2018-01-01", monthlyData: [] },
    { name: "Digital Masters Co.", username: "digitalmasters", profileLink: "https://example.com", pricingStart: 300, pricingMid: 1000, pricingTop: 3000, reviewsCount: 180, totalOrders: 220, workingSince: "2019-06-15", monthlyData: [] },
    { name: "Innovate Web Agency", username: "innovateweb", profileLink: "https://example.com", pricingStart: 800, pricingMid: 2500, pricingTop: 8000, reviewsCount: 400, totalOrders: 500, workingSince: "2017-03-20", monthlyData: [] },
    { name: "Pixel Perfect Freelancer", username: "pixelperfect", profileLink: "https://example.com", pricingStart: 100, pricingMid: 500, pricingTop: 1500, reviewsCount: 95, totalOrders: 110, workingSince: "2020-11-01", monthlyData: [] },
];
