import { pool } from '../config/db.js';

export const embeddingModel = {
  createText: async ({ userId, content }) => {
    const { rows } = await pool.query(
      `INSERT INTO texts (user_id, content) VALUES ($1, $2) RETURNING *`,
      [userId, content]
    );
    return rows[0];
  },

  saveEmbedding: async ({ textId, provider, model, dimensions, vector, durationMs }) => {
    const { rows } = await pool.query(
      `INSERT INTO embeddings (text_id, provider, model, dimensions, vector, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (text_id, model) DO UPDATE
         SET vector = EXCLUDED.vector,
             duration_ms = EXCLUDED.duration_ms
       RETURNING *`,
      [textId, provider, model, dimensions, JSON.stringify(vector), durationMs]
    );
    return rows[0];
  },

  getTextsByUser: async (userId) => {
    const { rows } = await pool.query(
      `SELECT t.id, t.content, t.created_at,
              json_agg(json_build_object(
                'provider', e.provider,
                'model', e.model,
                'dimensions', e.dimensions,
                'duration_ms', e.duration_ms
              )) AS embeddings
       FROM texts t
       LEFT JOIN embeddings e ON e.text_id = t.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [userId]
    );
    return rows;
  },

  getEmbeddingsByText: async (textId) => {
    const { rows } = await pool.query(
      `SELECT * FROM embeddings WHERE text_id = $1`,
      [textId]
    );
    return rows;
  },
};