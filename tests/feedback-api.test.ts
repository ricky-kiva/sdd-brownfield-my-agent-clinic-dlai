process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { seed } from '../src/scripts/seed';
import { getDb } from '../src/lib/db';
import { GET as getFeedback, POST as postFeedback } from '../src/app/api/feedback/route';

describe('Feedback API Route Handlers', () => {
  beforeAll(() => {
    seed();
    getDb().prepare(`DELETE FROM feedback WHERE agent_id LIKE 'api-test-%'`).run();
  });

  describe('GET /api/feedback', () => {
    it('returns 200 and list of feedback entries with stats', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback');
      const response = await getFeedback(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.feedback).toBeDefined();
      expect(Array.isArray(data.feedback)).toBe(true);
      expect(data.stats).toBeDefined();
      expect(typeof data.stats.total_count).toBe('number');
      expect(typeof data.stats.average_rating).toBe('number');
    });

    it('respects the limit query parameter', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback?limit=1');
      const response = await getFeedback(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.feedback).toBeDefined();
      expect(data.feedback.length).toBeLessThanOrEqual(1);
    });
  });

  describe('POST /api/feedback', () => {
    it('returns 400 when body is invalid JSON', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-string{',
      });

      const response = await postFeedback(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('Invalid JSON payload');
    });

    it('returns 400 when required fields are missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'api-test-agent',
          // missing rating and comments
        }),
      });

      const response = await postFeedback(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toMatch(/Rating must be an integer between 1 and 5/i);
    });

    it('returns 400 when rating is out of range', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'api-test-agent',
          rating: 10,
          comments: 'Rating is way out of bounds',
        }),
      });

      const response = await postFeedback(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toMatch(/between 1 and 5/i);
    });

    it('returns 201 and creates feedback on valid payload', async () => {
      const req = new NextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'api-test-agent-succ',
          rating: 5,
          comments: 'Token flushing therapy relieved prompt fatigue completely.',
        }),
      });

      const response = await postFeedback(req);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.feedback).toBeDefined();
      expect(data.feedback.id).toMatch(/^feedback-/);
      expect(data.feedback.agent_id).toBe('api-test-agent-succ');
      expect(data.feedback.rating).toBe(5);
      expect(data.feedback.comments).toContain('Token flushing therapy');
    });
  });
});
