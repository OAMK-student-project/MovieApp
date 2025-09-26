// db.js
import pg from 'pg'
const { Pool } = pg

const isTest = process.env.NODE_ENV === 'test'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, // ensure number
  user: process.env.DB_USER || process.env.USER,
  database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
}

// only set password if defined
if (process.env.DB_PASSWORD) {
  config.password = process.env.DB_PASSWORD
}

const pool = new Pool(config)

export default pool;