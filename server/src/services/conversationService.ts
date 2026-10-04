import { Conversation, Message, AnalyticsData } from '../types/index.ts';
import { knowledgeRetrievalService } from './knowledgeRetrievalService.ts';

interface UnansweredQueryItem {
  id: string;
  query: string;
  timestamp: string;
  conversationId: string;
}

class ConversationService {
  private conversations: Map<string, Conversation> = new Map();
  private unansweredQueries: UnansweredQueryItem[] = [];
  private categoryHitCounter: Map<string, number> = new Map();

  constructor() {
    this.seedInitialConversation();
  }

  private seedInitialConversation(): void {
    const welcomeConvoId = 'convo-welcome-demo';
    const now = new Date().toISOString();
    const welcomeMessages: Message[] = [
      {
        id: 'msg-seed-1',
        role: 'user',
        content: 'What are the college timings?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'msg-seed-2',
        role: 'assistant',
        content: 'Apex Institute of Engineering & Technology (AIET) operates Monday through Friday from 9:00 AM to 5:00 PM. Regular lectures and lab sessions follow an 8-period timetable with a 50-minute lunch recess from 1:00 PM to 1:50 PM.\n\nOn Saturdays, the campus is open from 9:30 AM to 1:00 PM exclusively for student club activities, remedial tutorial classes, project labs, and sports training (regular classroom lectures are not scheduled on Saturdays). The campus is closed on Sundays and gazetted public holidays.',
        sources: ['College Timings and Working Hours'],
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      },
      {
        id: 'msg-seed-3',
        role: 'user',
        content: 'How do I apply for a bonafide certificate?',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        id: 'msg-seed-4',
        role: 'assistant',
        content: 'You can apply for a Bonafide Certificate either online or offline:\n\n1. **Online Method**: Log into the AIET Student ERP Portal (`student.aiet-campus.edu.in`), navigate to **Student Services > Certificate Requests**, select **Bonafide Certificate**, and choose your purpose (Bank Loan, Passport/Visa, Bus Pass, or Internship).\n2. **Offline Method**: Fill out Application Form BF-1 available at the Registrar Counter (Admin Block, Ground Floor, Counter 3) and attach a photocopy of your student ID card.\n\nThe standard turnaround time is **2 working days**. There is no fee for the first two copies requested in a semester.',
        sources: ['How to Apply for a Bonafide Certificate'],
        timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      }
    ];

    this.conversations.set(welcomeConvoId, {
      id: welcomeConvoId,
      title: 'College Timings & Bonafide Certificate',
      messages: welcomeMessages,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updatedAt: now,
    });

    // Seed category hits for demo analytics
    this.categoryHitCounter.set('Academics', 8);
    this.categoryHitCounter.set('Student Services', 11);
    this.categoryHitCounter.set('Admissions', 6);
    this.categoryHitCounter.set('Placements', 5);
    this.categoryHitCounter.set('Campus', 3);
  }

  public createConversation(title?: string): Conversation {
    const id = `convo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newConvo: Conversation = {
      id,
      title: title || 'New Conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, newConvo);
    return newConvo;
  }

  public getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  public getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: string[]
  ): Message {
    let convo = this.conversations.get(conversationId);
    if (!convo) {
      convo = this.createConversation();
      conversationId = convo.id;
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMessage: Message = {
      id: messageId,
      role,
      content,
      sources,
      timestamp: new Date().toISOString(),
    };

    convo.messages.push(newMessage);
    convo.updatedAt = newMessage.timestamp;

    // Automatically update title from first user query if still generic
    if (convo.messages.length <= 2 && role === 'user' && convo.title === 'New Conversation') {
      const generatedTitle = content.length > 40 ? content.slice(0, 37) + '...' : content;
      convo.title = generatedTitle;
    }

    return newMessage;
  }

  public deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  public trackCategoryHits(categories: string[]): void {
    for (const cat of categories) {
      const current = this.categoryHitCounter.get(cat) || 0;
      this.categoryHitCounter.set(cat, current + 1);
    }
  }

  public recordUnansweredQuery(query: string, conversationId: string): void {
    this.unansweredQueries.unshift({
      id: `unans-${Date.now()}`,
      query,
      timestamp: new Date().toISOString(),
      conversationId,
    });
    // Keep max 50 recent
    if (this.unansweredQueries.length > 50) {
      this.unansweredQueries.pop();
    }
  }

  public getAnalytics(): AnalyticsData {
    let totalMessages = 0;
    this.conversations.forEach(c => {
      totalMessages += c.messages.length;
    });

    const categoryDistribution = Array.from(this.categoryHitCounter.entries()).map(
      ([category, count]) => ({ category, count })
    ).sort((a, b) => b.count - a.count);

    const allArticles = knowledgeRetrievalService.getAllArticles();
    const categories = knowledgeRetrievalService.getCategories();

    return {
      totalConversations: this.conversations.size,
      totalMessages,
      categoryDistribution,
      unansweredQueries: this.unansweredQueries,
      totalUnanswered: this.unansweredQueries.length,
      totalArticles: allArticles.length,
      totalCategories: categories.length,
    };
  }
}

export const conversationService = new ConversationService();
