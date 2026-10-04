import { Router, Request, Response } from 'express';
import { knowledgeRetrievalService } from '../services/knowledgeRetrievalService.ts';
import { Category } from '../types/index.ts';

const router = Router();

// GET /api/knowledge - Retrieve articles with optional search and category filters
router.get('/knowledge', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const articles = knowledgeRetrievalService.getAllArticles(
      category as Category | undefined,
      search as string | undefined
    );

    const categories = knowledgeRetrievalService.getCategories();

    res.json({
      articles,
      total: articles.length,
      categories,
    });
  } catch (error) {
    console.error('[KnowledgeRoutes] Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to retrieve knowledge base articles.' });
  }
});

// GET /api/knowledge/:id - Retrieve specific article by ID
router.get('/knowledge/:id', (req: Request, res: Response): void => {
  try {
    const article = knowledgeRetrievalService.getArticleById(req.params.id);
    if (!article) {
      res.status(404).json({ error: 'Knowledge article not found.' });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve knowledge article.' });
  }
});

export default router;
