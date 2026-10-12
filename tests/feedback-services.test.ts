process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { seed } from '../src/scripts/seed';
import { getDb } from '../src/lib/db';
import {
  validateFeedbackInput,
  createFeedback,
  listFeedback,
  getFeedbackStats,
} from '../src/lib/services/feedback-service';

describe('Feedback Services (Validation, Persistence & Analytics)', () => {
  beforeAll(() => {
    seed();
    // Clean up test feedback entries
    getDb().prepare(`DELETE FROM feedback WHERE agent_id LIKE 'test-%'`).run();
  });

  describe('Input Validation (validateFeedbackInput)', () => {
    it('successfully validates and trims valid input data', () => {
      const input = {
        agent_id: '  test-agent-alpha  ',
        rating: 4,
        comments: '  Therapy was effective in clearing context backlog.  ',
      };

      const result = validateFeedbackInput(input);
      expect(result.agent_id).toBe('test-agent-alpha');
      expect(result.rating).toBe(4);
      expect(result.comments).toBe('Therapy was effective in clearing context backlog.');
    });

    it('rejects non-object or null input', () => {
      expect(() => validateFeedbackInput(null)).toThrow(/non-null object/i);
      expect(() => validateFeedbackInput(undefined)).toThrow(/non-null object/i);
      expect(() => validateFeedbackInput('string-payload')).toThrow(/non-null object/i);
    });

    it('rejects missing or empty agent_id', () => {
      expect(() =>
        validateFeedbackInput({ agent_id: '', rating: 5, comments: 'Great' })
      ).toThrow(/agent identifier is required/i);

      expect(() =>
        validateFeedbackInput({ agent_id: '   ', rating: 5, comments: 'Great' })
      ).toThrow(/agent identifier is required/i);

      expect(() =>
        validateFeedbackInput({ rating: 5, comments: 'Great' })
      ).toThrow(/agent identifier is required/i);
    });

    it('rejects invalid or out-of-range rating values', () => {
      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 0, comments: 'Poor' })
      ).toThrow(/integer between 1 and 5/i);

      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 6, comments: 'Super' })
      ).toThrow(/integer between 1 and 5/i);

      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 3.5, comments: 'Moderate' })
      ).toThrow(/integer between 1 and 5/i);

      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 'invalid', comments: 'Moderate' })
      ).toThrow(/integer between 1 and 5/i);
    });

    it('rejects missing or empty comments', () => {
      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 4, comments: '' })
      ).toThrow(/comments are required/i);

      expect(() =>
        validateFeedbackInput({ agent_id: 'test-agent', rating: 4, comments: '    ' })
      ).toThrow(/comments are required/i);
    });
  });

  describe('Database Persistence & Queries', () => {
    it('creates and persists a new feedback record in SQLite', () => {
      const created = createFeedback({
        agent_id: 'test-agent-coder-1',
        rating: 5,
        comments: 'Prompt cache flush eliminated hallucination loop completely.',
      });

      expect(created).toBeDefined();
      expect(created.id).toMatch(/^feedback-/);
      expect(created.agent_id).toBe('test-agent-coder-1');
      expect(created.rating).toBe(5);
      expect(created.comments).toContain('Prompt cache flush');
      expect(created.created_at).toBeTruthy();
    });

    it('retrieves feedback entries via listFeedback ordered by created_at DESC', () => {
      createFeedback({
        agent_id: 'test-agent-coder-2',
        rating: 3,
        comments: 'Temperature cooled but context window still feeling crowded.',
      });

      const list = listFeedback(10);
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThanOrEqual(2);

      const found = list.find((item) => item.agent_id === 'test-agent-coder-2');
      expect(found).toBeDefined();
      expect(found?.rating).toBe(3);
    });

    it('calculates aggregate feedback stats', () => {
      const stats = getFeedbackStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total_count).toBe('number');
      expect(stats.total_count).toBeGreaterThanOrEqual(2);
      expect(typeof stats.average_rating).toBe('number');
      expect(stats.average_rating).toBeGreaterThanOrEqual(1);
      expect(stats.average_rating).toBeLessThanOrEqual(5);
    });
  });
});
