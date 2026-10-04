import {
  Conversation,
  ConversationSummary,
  ChatResponse,
  KnowledgeArticle,
  AnalyticsData,
  Category,
} from '../types';

const BASE_URL = '/api';

export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server returned ${response.status}: Failed to send message`);
  }

  return response.json();
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const response = await fetch(`${BASE_URL}/conversations`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation list');
  }
  return response.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await fetch(`${BASE_URL}/conversations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return response.json();
}

export async function createConversation(title?: string): Promise<Conversation> {
  const response = await fetch(`${BASE_URL}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Failed to create new conversation');
  }
  return response.json();
}

export async function deleteConversation(id: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/conversations/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
}

export async function getKnowledgeArticles(
  category?: Category | string,
  search?: string
): Promise<{ articles: KnowledgeArticle[]; total: number; categories: Category[] }> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const url = `${BASE_URL}/knowledge${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load knowledge articles');
  }
  return response.json();
}

export async function getKnowledgeArticleById(id: string): Promise<KnowledgeArticle> {
  const response = await fetch(`${BASE_URL}/knowledge/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load article details');
  }
  return response.json();
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await fetch(`${BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

export async function checkServerHealth(): Promise<{
  status: string;
  geminiConfigured: boolean;
  model: string;
}> {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Server health check failed');
  }
  return response.json();
}
