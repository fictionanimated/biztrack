
import { NextResponse } from 'next/server';
import { getFinancialMetrics } from '@/lib/services/analyticsService';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const financialData = await getFinancialMetrics();

    return NextResponse.json(financialData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    console.error('API GET Error fetching financial metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch financial metrics' }, { status: 500 });
  }
}
