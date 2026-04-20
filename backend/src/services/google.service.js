import { env } from '../config/env.js';

const GOOGLE_MODEL = 'text-embedding-004';
const GOOGLE_DIMENSIONS = 768;

export const googleService = {
  embed: async (text) => {
    const start = Date.now();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_MODEL}:embedContent?key=${env.googleApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${GOOGLE_MODEL}`,
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google error: ${error.error?.message}`);
    }

    const data = await response.json();

    return {
      provider: 'google',
      model: GOOGLE_MODEL,
      dimensions: GOOGLE_DIMENSIONS,
      vector: data.embedding.values,
      durationMs: Date.now() - start,
    };
  },
};