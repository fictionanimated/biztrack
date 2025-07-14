/**
 * @fileoverview Service for managing income source data.
 * This service abstracts the data access layer for income sources.
 * In this version, it uses a mock in-memory array.
 */
import { z } from 'zod';
import type { IncomeSource } from '@/lib/data/incomes-data';
import { formSchema as zodFormSchema, initialIncomeSources } from '@/lib/data/incomes-data';
import { format } from 'date-fns';

// Re-exporting for use in the API route
export { formSchema } from '@/lib/data/incomes-data';

// This is our in-memory "database"
let incomeSourcesStore: IncomeSource[] = [...initialIncomeSources];

/**
 * Retrieves all income sources.
 * @returns A promise that resolves to an array of all income sources.
 */
export async function getIncomeSources(): Promise<IncomeSource[]> {
  // In a real DB, this would be an async call.
  return Promise.resolve(incomeSourcesStore);
}

/**
 * Adds a new income source to the data store.
 * @param sourceData - The data for the new income source, validated against the form schema.
 * @returns The newly created income source object.
 */
export async function addIncomeSource(sourceData: z.infer<typeof zodFormSchema>): Promise<IncomeSource> {
  const newSource: IncomeSource = {
    id: `source-${Date.now()}`,
    name: sourceData.sourceName,
    gigs: sourceData.gigs.map((gig, index) => ({
      id: `g-${Date.now()}-${index}`,
      name: gig.name,
      date: format(new Date(gig.date), 'yyyy-MM-dd'),
      analytics: [],
    })),
    dataPoints: [],
  };

  // Add to the start of our in-memory array
  incomeSourcesStore = [newSource, ...incomeSourcesStore];
  
  return Promise.resolve(newSource);
}

/**
 * Updates the incomes page to use the in-memory data source.
 */
export async function getPersistedIncomeSources(): Promise<IncomeSource[]> {
    return await getIncomeSources();
}
