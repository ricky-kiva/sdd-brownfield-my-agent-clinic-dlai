import { NextRequest, NextResponse } from 'next/server';
import {
  createFeedback,
  listFeedback,
  getFeedbackStats,
  validateFeedbackInput,
} from '../../../lib/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const feedback = listFeedback(isNaN(limit) ? 50 : limit);
    const stats = getFeedbackStats();

    return NextResponse.json({ feedback, stats }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    try {
      const validated = validateFeedbackInput(body);
      const feedback = createFeedback(validated);

      return NextResponse.json({ feedback }, { status: 201 });
    } catch (validationOrServiceError) {
      return NextResponse.json(
        { error: (validationOrServiceError as Error).message || 'Invalid feedback submission' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}
