
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

const settingsSchema = z.object({
  timezone: z.string().optional(),
  monthlyTargets: z.record(z.string().regex(/^\d{4}-\d{2}$/), z.number()).optional(),
});

type Settings = z.infer<typeof settingsSchema>;

const SETTINGS_ID = 'user_settings'; // Use a consistent ID for the settings document

async function getSettingsCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Settings & { _id: string }>('settings');
}

export async function getSettings(): Promise<Partial<Settings>> {
  try {
    const settingsCollection = await getSettingsCollection();
    const settings = await settingsCollection.findOne({ _id: SETTINGS_ID });

    if (!settings) {
      return { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, monthlyTargets: {} };
    }
    
    return {
      timezone: settings.timezone,
      monthlyTargets: settings.monthlyTargets,
    };
  } catch (error) {
    console.error('Error fetching settings from DB:', error);
    return { monthlyTargets: {} };
  }
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<void> {
  try {
    const settingsCollection = await getSettingsCollection();
    
    const updatePayload: { [key: string]: any } = {};
    if (newSettings.timezone) {
      updatePayload['timezone'] = newSettings.timezone;
    }
    if (newSettings.monthlyTargets) {
      for (const [key, value] of Object.entries(newSettings.monthlyTargets)) {
        updatePayload[`monthlyTargets.${key}`] = value;
      }
    }

    await settingsCollection.updateOne(
      { _id: SETTINGS_ID },
      { $set: updatePayload },
      { upsert: true } // Creates the document if it doesn't exist
    );
  } catch (error) {
      console.error('Error updating settings in DB:', error);
      throw new Error('Failed to update settings in the database.');
  }
}
