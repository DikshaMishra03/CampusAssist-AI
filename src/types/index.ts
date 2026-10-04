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

export interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  reply: string;
  sources: string[];
  conversationId: string;
  messageId: string;
  isUnanswered?: boolean;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'applicant';
  rollNumber?: string;
  department?: string;
  semester?: string;
  cgpa?: number;
  attendancePercent?: number;
  hostelResident?: boolean;
}

