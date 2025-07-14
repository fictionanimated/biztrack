
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

const settingsSchema = z.object({
  timezone: z.string().optional(),
});

type Settings = z.infer<typeof settingsSchema>;

const SETTINGS_ID = 'user_settings'; // Use a consistent ID for the settings document

async function getSettingsCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Settings>('settings');
}

export async function getSettings(): Promise<Partial<Settings>> {
  try {
    const settingsCollection = await getSettingsCollection();
    const settings = await settingsCollection.findOne({ _id: SETTINGS_ID as any });

    if (!settings) {
      return {};
    }
    
    return {
      timezone: settings.timezone,
    };
  } catch (error) {
    console.error('Error fetching settings from DB:', error);
    return {};
  }
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<void> {
  try {
    const settingsCollection = await getSettingsCollection();
    await settingsCollection.updateOne(
      { _id: SETTINGS_ID as any },
      { $set: newSettings },
      { upsert: true } // Creates the document if it doesn't exist
    );
  } catch (error) {
      console.error('Error updating settings in DB:', error);
      throw new Error('Failed to update settings in the database.');
  }
}
