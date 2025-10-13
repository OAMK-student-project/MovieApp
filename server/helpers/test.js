import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import db from './db.js';

//import pool from './db.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Reset schema from database.sql
async function initializeTestDb() {
  const sql = fs.readFileSync(path.resolve(__dirname, '../database.sql'), 'utf8')
  const statements = sql.split(';').filter(s => s.trim() !== '')
  for (const stmt of statements) {
    await db.query(stmt)
  }
  console.log('Test DB initialized')
}

// Clean up between tests
async function clearDb() {
  await db.query('TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE') //ENABLE TO CLEAR TEST DATA
}

// Insert test user, no bcrypt for test (yet)
async function insertTestUser({email, password_hash, firstname, lastname  }) {
  if (!email || !password_hash || !firstname || !lastname) throw new Error('Email and password_hash required')

const res = await db.query(
  'INSERT INTO "Users" (id, email, password_hash, firstname, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, password_hash, firstname, lastname',
  [1, email, password_hash, firstname, lastname]
)


  return res.rows[0]
}


export { initializeTestDb, clearDb, insertTestUser }
