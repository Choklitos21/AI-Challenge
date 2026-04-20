const requiredVars = [
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
  'SESSION_SECRET', 'OPENAI_API_KEY', 'GOOGLE_API_KEY'
];

for (const key of requiredVars) {
  if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
}

export const env = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
};