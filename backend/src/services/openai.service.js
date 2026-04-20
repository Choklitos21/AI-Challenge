import { env } from '../config/env.js';

const OPENAI_MODEL = 'text-embedding-3-small';
const OPENAI_DIMENSIONS = 1536;

export const openaiService = {
  embed: async (text) => {
    const start = Date.now();

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI error: ${error.error?.message}`);
    }

    const data = await response.json();

    return {
      provider: 'openai',
      model: OPENAI_MODEL,
      dimensions: OPENAI_DIMENSIONS,
      vector: data.data[0].embedding,
      durationMs: Date.now() - start,
    };
  },
};