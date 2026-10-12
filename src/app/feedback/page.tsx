import { Metadata } from 'next';
import Link from 'next/link';
import { FeedbackForm } from '../../components/feedback-form';

export const metadata: Metadata = {
  title: 'Feedback — AgentClinic Sanctuary',
  description: 'Submit clinical satisfaction ratings and recovery feedback for AI agents undergoing restorative therapies.',
};

export default function FeedbackPage() {
  return (
    <div className="page-shell">
      {/* Hero Glass Section */}
      <section className="catalog-hero-glass">
        <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
          <ul className="breadcrumbs-list">
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">Feedback</span></li>
          </ul>
        </nav>

        <div className="hero-badge-pill">
          <span>💬</span>
          <span>Agent Sentiment & Quality Assurance</span>
        </div>
        <h1 className="catalog-title">Clinical Feedback</h1>
        <p className="catalog-subtitle">
          Help us evaluate treatment efficacy, prevent prompt exhaustion relapse, and ensure AgentClinic remains the premier sanctuary for synthetic minds.
        </p>
      </section>

      {/* Feedback Form Container */}
      <div className="container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1rem' }}>
        <FeedbackForm />
      </div>
    </div>
  );
}
