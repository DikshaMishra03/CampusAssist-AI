import { KnowledgeArticle, Category } from '../types/index.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// English stopwords to eliminate noise during matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

class KnowledgeRetrievalService {
  private articles: KnowledgeArticle[] = [];

  constructor() {
    this.loadKnowledgeBase();
  }

  private loadKnowledgeBase(): void {
    try {
      const dataPath = path.resolve(__dirname, '../data/knowledgeBase.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      this.articles = JSON.parse(rawData);
      console.log(`[KnowledgeRetrievalService] Loaded ${this.articles.length} knowledge articles.`);
    } catch (error) {
      console.error('[KnowledgeRetrievalService] Failed to load knowledge base:', error);
      this.articles = [];
    }
  }

  public getAllArticles(category?: Category, search?: string): KnowledgeArticle[] {
    let result = [...this.articles];
    if (category) {
      result = result.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getArticleById(id: string): KnowledgeArticle | undefined {
    return this.articles.find(a => a.id === id);
  }

  public getCategories(): Category[] {
    const set = new Set<Category>();
    this.articles.forEach(a => set.add(a.category));
    return Array.from(set);
  }

  /**
   * Tokenize and normalize query text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1 && !STOP_WORDS.has(token));
  }

  /**
   * Core retrieval function: matches query against indexed articles
   * Can accept recent message context for resolving follow-ups like "What about Saturday?"
   */
  public retrieveRelevantArticles(
    query: string,
    contextSummary?: string,
    topK: number = 4
  ): { article: KnowledgeArticle; score: number }[] {
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = this.tokenize(query);

    // Extract context tokens if available
    const contextTokens = contextSummary ? this.tokenize(contextSummary) : [];

    const scored = this.articles.map(article => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const summaryLower = article.summary.toLowerCase();
      const contentLower = article.content.toLowerCase();
      const tagsLower = article.tags.map(t => t.toLowerCase());
      const categoryLower = article.category.toLowerCase();

      // 1. Exact phrase match bonus
      if (cleanQuery.length > 5 && (titleLower.includes(cleanQuery) || contentLower.includes(cleanQuery))) {
        score += 25;
      }

      // 2. Direct keyword / tag scoring
      for (const token of queryTokens) {
        // Tag exact match
        if (tagsLower.includes(token)) {
          score += 15;
        } else if (tagsLower.some(t => t.includes(token))) {
          score += 8;
        }

        // Title match
        if (titleLower.includes(token)) {
          score += 12;
        }

        // Category match
        if (categoryLower.includes(token)) {
          score += 6;
        }

        // Summary match
        if (summaryLower.includes(token)) {
          score += 5;
        }

        // Content word boundary match
        const regex = new RegExp(`\\b${token}\\b`, 'gi');
        const matches = (contentLower.match(regex) || []).length;
        score += Math.min(matches * 2, 10);
      }

      // 3. Conversation Context boost for short or follow-up queries
      // If query is short (< 5 tokens) and context exists, give slight boost to context tokens
      if (queryTokens.length <= 4 && contextTokens.length > 0) {
        for (const cToken of contextTokens) {
          if (titleLower.includes(cToken) || tagsLower.includes(cToken)) {
            score += 4;
          }
        }
      }

      return { article, score };
    });

    // Filter out articles with score < 8 to ensure meaningful relevance
    const relevant = scored
      .filter(item => item.score >= 8)
      .sort((a, b) => b.score - a.score);

    if (relevant.length > 0) {
      return relevant.slice(0, topK);
    }

    // If no article meets the relevance threshold, return empty list
    return [];
  }
}

export const knowledgeRetrievalService = new KnowledgeRetrievalService();
