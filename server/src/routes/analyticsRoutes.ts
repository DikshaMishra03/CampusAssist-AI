import { Router, Request, Response } from 'express';
import { conversationService } from '../services/conversationService.ts';

const router = Router();

// GET /api/analytics - Get aggregate stats, unanswered query log, and category breakdown
router.get('/analytics', (_req: Request, res: Response) => {
  try {
    const analytics = conversationService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('[AnalyticsRoutes] Error generating analytics:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics data.' });
  }
});

export default router;
