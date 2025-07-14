/**
 * @fileoverview Service for managing income source data.
 * This service abstracts the data access layer for income sources.
 * Currently, it uses a mock in-memory data store.
 */
import { z } from 'zod';
import { initialIncomeSources } from '@/lib/data/incomes-data';
import type { IncomeSource, Gig } from '@/lib/data/incomes-data';
import { format } from 'date-fns';

// Re-exporting for use in the API route
export { formSchema } from '@/lib/data/incomes-data';
import { formSchema as zodFormSchema } from '@/lib/data/incomes-data';

// This is our in-memory "database"
let incomeSourcesStore: IncomeSource[] = [...initialIncomeSources];

/**
 * Retrieves all income sources.
 * @returns A promise that resolves to an array of all income sources.
 */
export function getIncomeSources(): Promise<IncomeSource[]> {
  // In a real application, this would fetch from a database.
  return Promise.resolve(incomeSourcesStore);
}

/**
 * Adds a new income source to the data store.
 * @param sourceData - The data for the new income source, validated against the form schema.
 * @returns The newly created income source object.
 */
export function addIncomeSource(sourceData: z.infer<typeof zodFormSchema>): IncomeSource {
  const newSource: IncomeSource = {
    id: `source-${Date.now()}`,
    name: sourceData.sourceName,
    gigs: sourceData.gigs.map((gig, index) => ({
      id: `g-${Date.now()}-${index}`,
      name: gig.name,
      date: format(gig.date, 'yyyy-MM-dd'),
      analytics: [],
    })),
    dataPoints: [],
  };

  // Prepend the new source to our in-memory store
  incomeSourcesStore = [newSource, ...incomeSourcesStore];
  
  // In a real application, you would insert into a database here.
  
  return newSource;
}
