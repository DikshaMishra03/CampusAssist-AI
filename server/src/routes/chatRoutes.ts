import { Router, Request, Response } from 'express';
import { conversationService } from '../services/conversationService.ts';
import { knowledgeRetrievalService } from '../services/knowledgeRetrievalService.ts';
import { generateCampusResponse } from '../services/geminiService.ts';

const router = Router();

// POST /api/chat - Send message and receive AI response
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message content is required and cannot be empty.' });
      return;
    }

    if (message.length > 2000) {
      res.status(400).json({ error: 'Message exceeds maximum allowable length (2000 characters).' });
      return;
    }

    // Retrieve or create conversation
    let convo = conversationId ? conversationService.getConversation(conversationId) : undefined;
    if (!convo) {
      convo = conversationService.createConversation();
    }

    // Save user message to conversation memory
    conversationService.addMessage(convo.id, 'user', message.trim());

    // Gather context from previous turns for follow-ups
    const recentMessages = convo.messages.slice(-4);
    const recentContext = recentMessages
      .map(m => `${m.role}: ${m.content}`)
      .join(' ');

    // Retrieve relevant knowledge base articles
    const scoredMatches = knowledgeRetrievalService.retrieveRelevantArticles(
      message.trim(),
      recentContext,
      4
    );

    const relevantArticles = scoredMatches.map(m => m.article);

    // Track analytics for matched categories
    const matchedCategories = Array.from(new Set(relevantArticles.map(a => a.category)));
    if (matchedCategories.length > 0) {
      conversationService.trackCategoryHits(matchedCategories);
    }

    // Call Gemini API (with server-side safety and knowledge grounding)
    const { text, sources, isUnanswered } = await generateCampusResponse(
      message.trim(),
      convo.messages,
      relevantArticles
    );

    // If answer was unavailable, record unanswered query for analytics
    if (isUnanswered) {
      conversationService.recordUnansweredQuery(message.trim(), convo.id);
    }

    // Save assistant message to conversation memory
    const assistantMsg = conversationService.addMessage(
      convo.id,
      'assistant',
      text,
      sources
    );

    res.json({
      reply: assistantMsg.content,
      sources: assistantMsg.sources || [],
      conversationId: convo.id,
      messageId: assistantMsg.id,
      isUnanswered,
    });
  } catch (error) {
    console.error('[ChatRoutes] Error processing chat request:', error);
    res.status(500).json({
      error: 'An unexpected internal error occurred while processing your request. Please try again.',
    });
  }
});

// GET /api/conversations - List all conversations
router.get('/conversations', (_req: Request, res: Response) => {
  try {
    const list = conversationService.getAllConversations().map(c => ({
      id: c.id,
      title: c.title,
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      lastMessagePreview: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.slice(0, 80) : '',
    }));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversations.' });
  }
});

// POST /api/conversations - Create a new conversation thread
router.post('/conversations', (req: Request, res: Response) => {
  try {
    const { title } = req.body || {};
    const convo = conversationService.createConversation(title);
    res.status(201).json(convo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize conversation.' });
  }
});

// GET /api/conversations/:id - Get details and full messages of a conversation
router.get('/conversations/:id', (req: Request, res: Response): void => {
  try {
    const convo = conversationService.getConversation(req.params.id);
    if (!convo) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }
    res.json(convo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation.' });
  }
});

// DELETE /api/conversations/:id - Delete a conversation
router.delete('/conversations/:id', (req: Request, res: Response): void => {
  try {
    const success = conversationService.deleteConversation(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Conversation not found or already deleted.' });
      return;
    }
    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

export default router;
