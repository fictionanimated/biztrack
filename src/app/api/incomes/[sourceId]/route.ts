
import { NextResponse } from 'next/server';
import { getIncomeSources, deleteIncomeSource } from '@/lib/services/incomesService';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { sourceId: string } }) {
  try {
    const incomes = await getIncomeSources();
    const source = incomes.find(s => s.id === params.sourceId);

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json(source);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Argument passed in must be a string of 12 bytes or a string of 24 hex characters")) {
        return NextResponse.json({ error: 'Invalid source ID format' }, { status: 400 });
    }
    console.error('API GET Error fetching income source:', error);
    return NextResponse.json({ error: 'Failed to fetch income source' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { sourceId: string } }) {
  try {
    const success = await deleteIncomeSource(params.sourceId);

    if (!success) {
      return NextResponse.json({ error: 'Income source not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Income source deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Argument passed in must be a string of 12 bytes or a string of 24 hex characters")) {
        return NextResponse.json({ error: 'Invalid source ID format' }, { status: 400 });
    }
    console.error('API DELETE Error deleting income source:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
