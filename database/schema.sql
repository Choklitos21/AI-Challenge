CREATE EXTENSION IF NOT EXISTS vector;

-- Usuarios
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- bcrypt hash
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Textos fuente (el texto original que se embebe)
CREATE TABLE IF NOT EXISTS texts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Embeddings generados por modelo
CREATE TABLE IF NOT EXISTS embeddings (
  id         SERIAL PRIMARY KEY,
  text_id    INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  provider   VARCHAR(50)  NOT NULL,           -- 'openai' | 'cohere'
  model      VARCHAR(100) NOT NULL,           -- 'text-embedding-3-small' | 'embed-english-v3.0'
  dimensions INTEGER NOT NULL,               -- 1536, 1024, etc.
  vector     vector,                   -- dimensión máxima; NULL si difiere (ver nota)
  duration_ms INTEGER,                       -- tiempo que tardó la API en responder
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(text_id, model)                     -- un embedding por texto+modelo
);

-- Índice para búsqueda por similitud coseno (útil si después quieres hacer similarity search)
CREATE INDEX IF NOT EXISTS embeddings_vector_idx
  ON embeddings USING ivfflat (vector vector_cosine_ops)
  WITH (lists = 100);