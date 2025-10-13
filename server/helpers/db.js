// db.js
import pg from 'pg';
const { Pool } = pg;

const isTest = process.env.DB_ENV === 'testing';

const config = isTest
  ? {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT ? parseInt(process.env.TEST_DB_PORT, 10) : 5432,
      user: process.env.TEST_DB_USER || process.env.USER,
      database: process.env.TEST_DB_NAME,
      ssl: false,
      ...(process.env.TEST_DB_PASSWORD ? { password: process.env.TEST_DB_PASSWORD } : {})
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      user: process.env.DB_USER || process.env.USER,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      ...(process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {})
    };

const db = new Pool(config);
export default db;
