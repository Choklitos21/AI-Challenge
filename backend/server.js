import './src/config/env.js';
import { app } from './src/app.js';
import { env } from './src/config/env.js';
import { pool } from './src/config/db.js';


const start = async () => {
  await pool.query('SELECT 1');
  console.log('DB connected');

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});