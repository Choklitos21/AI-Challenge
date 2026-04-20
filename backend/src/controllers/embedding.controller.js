import { embeddingService } from '../services/embedding.service.js';

export const embeddingController = {
  process: async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await embeddingService.processText({
      userId: req.session.userId,
      content: content.trim(),
    });

    res.status(201).json(result);
  },

  history: async (req, res) => {
    const texts = await embeddingService.getHistory(req.session.userId);
    res.json({ texts });
  },
};