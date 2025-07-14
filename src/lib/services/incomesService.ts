/**
 * @fileoverview Service for managing income source data.
 * This service abstracts the data access layer for income sources.
 * It uses a local JSON file as a mock database.
 */
import { z } from 'zod';
import type { IncomeSource } from '@/lib/data/incomes-data';
import { formSchema as zodFormSchema } from '@/lib/data/incomes-data';
import { format } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

// Re-exporting for use in the API route
export { formSchema } from '@/lib/data/incomes-data';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'incomes.json');

async function readData(): Promise<IncomeSource[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading from data file:', error);
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writeData(data: IncomeSource[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing to data file:', error);
  }
}


/**
 * Retrieves all income sources.
 * @returns A promise that resolves to an array of all income sources.
 */
export async function getIncomeSources(): Promise<IncomeSource[]> {
  return await readData();
}

/**
 * Adds a new income source to the data store.
 * @param sourceData - The data for the new income source, validated against the form schema.
 * @returns The newly created income source object.
 */
export async function addIncomeSource(sourceData: z.infer<typeof zodFormSchema>): Promise<IncomeSource> {
  const currentSources = await readData();
  
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

  const updatedSources = [newSource, ...currentSources];
  await writeData(updatedSources);
  
  return newSource;
}

/**
 * Updates the incomes page to use the persistent data source.
 * In a real app, this might be a database call. Here we just re-read the file.
 */
export async function getPersistedIncomeSources(): Promise<IncomeSource[]> {
    return await readData();
}
