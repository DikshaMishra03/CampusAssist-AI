export type Category = 
  | 'Admissions'
  | 'Academics'
  | 'Departments'
  | 'Student Services'
  | 'Placements'
  | 'Campus'
  | 'Contact';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  summary: string;
  content: string;
  officialReference?: string;
  lastUpdated: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  sources: string[];
  conversationId: string;
  messageId: string;
  isUnanswered?: boolean;
}

export interface KnowledgeQueryResult {
  articles: KnowledgeArticle[];
  total: number;
  categories: Category[];
}

export interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  categoryDistribution: { category: string; count: number }[];
  unansweredQueries: { id: string; query: string; timestamp: string; conversationId: string }[];
  totalUnanswered: number;
  totalArticles: number;
  totalCategories: number;
}
