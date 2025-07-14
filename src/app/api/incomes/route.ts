// /src/app/api/incomes/route.ts
import { NextResponse } from 'next/server';
import { addIncomeSource, formSchema } from '@/lib/services/incomesService';
import { z } from 'zod';

/**
 * @fileoverview API route for handling income sources.
 *
 * - POST: Creates a new income source.
 */

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = formSchema.parse(json);

    const newSource = await addIncomeSource(parsedData);

    return NextResponse.json(
      { message: 'Income source added successfully', source: newSource },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
