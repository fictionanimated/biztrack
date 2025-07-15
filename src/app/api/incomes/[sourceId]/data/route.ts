
import { NextResponse } from 'next/server';
import { addDataToSource } from '@/lib/services/incomesService';
import { z } from 'zod';

const addSourceDataFormSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    messages: z.coerce.number().int().min(0, { message: "Number of messages must be a non-negative number." }),
});

export async function POST(request: Request, { params }: { params: { sourceId: string } }) {
  try {
    const json = await request.json();
    const parsedJson = { ...json, date: new Date(json.date) };
    const parsedData = addSourceDataFormSchema.parse(parsedJson);

    const updatedSource = await addDataToSource(params.sourceId, parsedData);

    if (!updatedSource) {
      return NextResponse.json({ error: 'Source not found or failed to add data' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data added successfully', source: updatedSource }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    console.error('API Error adding source data:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
