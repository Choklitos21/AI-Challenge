import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import embeddingRoutes from './routes/embedding.routes.js';

export const app = express();

app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(express.json());
app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
}));

app.use('/api/auth', authRoutes);
app.use('/api/embeddings', embeddingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});