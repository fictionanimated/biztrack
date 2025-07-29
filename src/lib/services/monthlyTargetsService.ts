
import clientPromise from '@/lib/mongodb';
import { format } from 'date-fns';

interface MonthlyTarget {
  _id: string; // Format: "YYYY-MM"
  target: number;
}

async function getMonthlyTargetsCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<MonthlyTarget>('monthlyTargets');
}

/**
 * Retrieves all monthly targets from the database.
 * @returns A promise that resolves to a record of targets, e.g., { "2024-07": 50000 }.
 */
export async function getMonthlyTargets(): Promise<Record<string, number>> {
  try {
    const targetsCollection = await getMonthlyTargetsCollection();
    const targets = await targetsCollection.find({}).toArray();

    return targets.reduce((acc, doc) => {
      acc[doc._id] = doc.target;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching monthly targets from DB:', error);
    return {};
  }
}

/**
 * Sets or updates a monthly target for a specific year and month.
 * @param year - The target year.
 * @param month - The target month (1-12).
 * @param target - The revenue target value.
 */
export async function setMonthlyTarget(year: number, month: number, target: number): Promise<void> {
  try {
    const targetsCollection = await getMonthlyTargetsCollection();
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    await targetsCollection.updateOne(
      { _id: monthKey },
      { $set: { target: target } },
      { upsert: true } // Creates the document if it doesn't exist
    );
  } catch (error) {
    console.error('Error updating monthly target in DB:', error);
    throw new Error('Failed to update target in the database.');
  }
}
