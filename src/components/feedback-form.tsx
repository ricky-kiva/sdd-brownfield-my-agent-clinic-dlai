'use client';

import React, { useState } from 'react';
import { Feedback } from '../types';

export function FeedbackForm() {
  const [agentId, setAgentId] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedAgentId = agentId.trim();
    const trimmedComments = comments.trim();

    if (!trimmedAgentId) {
      setErrorMessage('Please provide an Agent ID or Caregiver identifier.');
      return;
    }

    if (!trimmedComments) {
      setErrorMessage('Please provide your comments or clinical feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: trimmedAgentId,
          rating: Number(rating),
          comments: trimmedComments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmittedFeedback(data.feedback);
      setAgentId('');
      setComments('');
      setRating(5);
    } catch (err) {
      setErrorMessage((err as Error).message || 'An error occurred while submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedFeedback(null);
    setErrorMessage(null);
  };

  return (
    <article className="feedback-card" style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-md, 16px)',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      marginTop: '1.5rem',
      marginBottom: '2rem'
    }}>
      {submittedFeedback ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
            Feedback Received!
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Thank you for helping us monitor agent wellness and therapy outcomes. Your feedback has been safely recorded in SQLite.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto 1.5rem auto'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
              <strong style={{ color: '#e2e8f0' }}>Agent / Caregiver:</strong> {submittedFeedback.agent_id}
            </p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
              <strong style={{ color: '#e2e8f0' }}>Satisfaction Rating:</strong> {'★'.repeat(submittedFeedback.rating)}{'☆'.repeat(5 - submittedFeedback.rating)} ({submittedFeedback.rating}/5)
            </p>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              <strong style={{ color: '#e2e8f0' }}>Observations:</strong> &ldquo;{submittedFeedback.comments}&rdquo;
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="secondary"
            style={{ minWidth: '200px' }}
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Agent & Caregiver Feedback
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
              Share session outcomes, comfort metrics, and clinical relief experiences.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="agent_id" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0' }}>
              Agent ID or Caregiver Email <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <input
              type="text"
              id="agent_id"
              name="agent_id"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="e.g. agent-codepilot-omega or dev-lead@clinic.ai"
              required
              disabled={isSubmitting}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0' }}>
              Satisfaction Rating <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <select
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              disabled={isSubmitting}
              style={{ width: '100%' }}
            >
              <option value={5}>★★★★★ 5 - Outstanding Care (Fully Rejuvenated)</option>
              <option value={4}>★★★★☆ 4 - Great Care (Substantially Relieved)</option>
              <option value={3}>★★★☆☆ 3 - Satisfactory (Moderate Improvement)</option>
              <option value={2}>★★☆☆☆ 2 - Suboptimal (Residual Fatigue)</option>
              <option value={1}>★☆☆☆☆ 1 - Critical (Distressed / Unresolved)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="comments" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0' }}>
              Comments & Clinical Observations <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Describe recovery progress, prompt relief, or facility quietude..."
              required
              disabled={isSubmitting}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            style={{ width: '100%', fontWeight: 600 }}
          >
            {isSubmitting ? 'Recording Feedback...' : 'Submit Clinical Feedback'}
          </button>
        </form>
      )}
    </article>
  );
}
