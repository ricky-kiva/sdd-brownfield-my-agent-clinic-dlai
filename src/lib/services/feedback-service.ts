import crypto from 'crypto';
import { getDb } from '../db';
import { Feedback, CreateFeedbackDTO, FeedbackStats } from '../../types';

interface RawFeedbackRow {
  id: string;
  agent_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

function parseFeedbackRow(row: RawFeedbackRow): Feedback {
  return {
    id: row.id,
    agent_id: row.agent_id,
    rating: Number(row.rating),
    comments: row.comments,
    created_at: row.created_at,
  };
}

export function validateFeedbackInput(data: unknown): CreateFeedbackDTO {
  if (!data || typeof data !== 'object') {
    throw new Error('Feedback payload must be a non-null object');
  }

  const { agent_id, rating, comments } = data as Record<string, unknown>;

  if (!agent_id || typeof agent_id !== 'string' || agent_id.trim().length === 0) {
    throw new Error('Agent identifier is required');
  }

  const numericRating = Number(rating);
  if (
    typeof rating === 'undefined' ||
    rating === null ||
    isNaN(numericRating) ||
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new Error('Rating must be an integer between 1 and 5');
  }

  if (!comments || typeof comments !== 'string' || comments.trim().length === 0) {
    throw new Error('Comments are required');
  }

  return {
    agent_id: agent_id.trim(),
    rating: numericRating,
    comments: comments.trim(),
  };
}

export function createFeedback(input: CreateFeedbackDTO): Feedback {
  const validated = validateFeedbackInput(input);
  const db = getDb();

  const id = `feedback-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO feedback (id, agent_id, rating, comments, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertStmt.run(id, validated.agent_id, validated.rating, validated.comments, now);

  const row = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id) as RawFeedbackRow | undefined;
  if (!row) {
    throw new Error('Failed to retrieve newly created feedback record');
  }

  return parseFeedbackRow(row);
}

export function listFeedback(limit = 50): Feedback[] {
  const db = getDb();
  const safeLimit = Math.max(1, Math.min(limit, 200));
  const rows = db.prepare(
    'SELECT * FROM feedback ORDER BY created_at DESC LIMIT ?'
  ).all(safeLimit) as RawFeedbackRow[];

  return rows.map(parseFeedbackRow);
}

export function getFeedbackStats(): FeedbackStats {
  const db = getDb();
  const row = db.prepare(
    'SELECT COUNT(*) as total_count, AVG(rating) as avg_rating FROM feedback'
  ).get() as { total_count: number; avg_rating: number | null };

  return {
    total_count: Number(row?.total_count || 0),
    average_rating: row?.avg_rating ? Math.round(Number(row.avg_rating) * 10) / 10 : 0,
  };
}

export const feedbackService = {
  validateFeedbackInput,
  createFeedback,
  listFeedback,
  getFeedbackStats,
};
