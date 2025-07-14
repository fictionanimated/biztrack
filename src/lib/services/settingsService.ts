
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

const settingsSchema = z.object({
  timezone: z.string(),
});

type Settings = z.infer<typeof settingsSchema>;

const SETTINGS_ID = 'user_settings'; // Use a consistent ID for the settings document

async function getDb() {
  const client = await clientPromise;
  return client.db(); 
}

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const settings = await db.collection('settings').findOne({ _id: SETTINGS_ID });

  if (settings) {
    return {
      timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // Return default settings if none are found in the DB
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<void> {
  const db = await getDb();
  await db.collection('settings').updateOne(
    { _id: SETTINGS_ID },
    { $set: newSettings },
    { upsert: true } // Creates the document if it doesn't exist
  );
}
