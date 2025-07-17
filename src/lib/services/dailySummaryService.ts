
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { type DailySummary, initialSummaries } from '@/lib/data/daily-summary-data';

// This is the shape of data coming from the validated API route.
interface ApiSummaryData {
    date: string; // YYYY-MM-DD format
    content: string;
}

async function getSummariesCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Omit<DailySummary, 'id'>>('dailySummaries');
}

async function seedSummaries() {
    const summariesCollection = await getSummariesCollection();
    const count = await summariesCollection.countDocuments();
    if (count === 0) {
        console.log("Seeding 'dailySummaries' collection...");
        const summariesToInsert = initialSummaries.map(s => ({
            ...s,
            _id: new ObjectId(),
        }));
        await summariesCollection.insertMany(summariesToInsert as any[]);
    }
}

export async function getDailySummaries(): Promise<DailySummary[]> {
  const summariesCollection = await getSummariesCollection();
  await seedSummaries();
  const summaries = await summariesCollection.find({}).sort({ date: -1 }).toArray();
  return summaries.map(summary => ({
     ...summary, 
     id: summary._id.toString(),
     date: summary.date,
    }));
}

export async function addDailySummary(summaryData: ApiSummaryData): Promise<DailySummary> {
  const summariesCollection = await getSummariesCollection();

  const existingSummary = await summariesCollection.findOne({ date: summaryData.date });
  if (existingSummary) {
    throw new Error(`A summary for ${summaryData.date} already exists.`);
  }

  const newSummary = {
    _id: new ObjectId(),
    date: summaryData.date,
    content: summaryData.content,
  };

  const result = await summariesCollection.insertOne(newSummary as any);
  if (!result.insertedId) {
    throw new Error('Failed to insert new summary.');
  }

  return {
    ...newSummary,
    id: result.insertedId.toString(),
  };
}

export async function updateDailySummary(summaryId: string, summaryData: ApiSummaryData): Promise<DailySummary | null> {
  const summariesCollection = await getSummariesCollection();
  const _id = new ObjectId(summaryId);
  
  const updateData = {
    content: summaryData.content,
    date: summaryData.date
  };

  const result = await summariesCollection.findOneAndUpdate(
    { _id },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) return null;
  return { ...result, id: result._id.toString() } as DailySummary;
}

export async function deleteDailySummary(summaryId: string): Promise<boolean> {
  const summariesCollection = await getSummariesCollection();
  const _id = new ObjectId(summaryId);
  const result = await summariesCollection.deleteOne({ _id });
  return result.deletedCount === 1;
}
