
import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/services/settingsService';
import { z } from 'zod';

const settingsSchema = z.object({
  timezone: z.string(),
});

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = settingsSchema.parse(json);

    await updateSettings(parsedData);

    return NextResponse.json({ message: 'Settings updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
