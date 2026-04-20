import { openaiService } from './openai.service.js';
import { googleService } from './google.service.js';
import { embeddingModel } from '../models/embedding.model.js';

const providers = {
  openai: openaiService,
  google: googleService,
};

export const embeddingService = {
  processText: async ({ userId, content }) => {
    const text = await embeddingModel.createText({ userId, content });

    const results = await Promise.allSettled(
      Object.values(providers).map(service => service.embed(content))
    );

    const saved = [];
    const failed = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const embedding = await embeddingModel.saveEmbedding({
          textId: text.id,
          ...result.value,
        });
        saved.push(embedding);
      } else {
        failed.push(result.reason.message);
      }
    }

    return { text, saved, failed };
  },

  getHistory: async (userId) => {
    return embeddingModel.getTextsByUser(userId);
  },
};