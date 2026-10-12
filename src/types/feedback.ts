export interface Feedback {
  id: string;
  agent_id: string;
  rating: number; // Integer between 1 and 5
  comments: string;
  created_at: string;
}

export interface CreateFeedbackDTO {
  agent_id: string;
  rating: number;
  comments: string;
}

export interface FeedbackStats {
  total_count: number;
  average_rating: number;
}
