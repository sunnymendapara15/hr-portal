const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = process.env;

const databaseUrl = env.DATABASE_URL
  ? path.isAbsolute(env.DATABASE_URL)
    ? env.DATABASE_URL
    : path.resolve(process.cwd(), env.DATABASE_URL)
  : path.resolve(process.cwd(), 'data/hr-portal.db');

module.exports = {
  port: Number(env.PORT) || 4000,
  jwtSecret: env.JWT_SECRET || 'change-me',
  databaseUrl,
  corsOrigin: env.CORS_ORIGIN || '*',
  adminEmail: (env.ADMIN_EMAIL || 'admin@hrportal.local').toLowerCase(),
  adminPassword: env.ADMIN_PASSWORD || 'Password123!',
};
