// db.js
import pg from 'pg'
const { Pool } = pg

const isTest = process.env.NODE_ENV === 'test'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, // ensure number
  user: process.env.DB_USER || process.env.USER,
  database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
}

// only set password if defined
if (process.env.DB_PASSWORD) {
  config.password = process.env.DB_PASSWORD
}

const pool = new Pool(config)

export { pool }




/*
import pkg from 'pg'
import dotenv from 'dotenv'

const enviroment = process.env.NODE_ENV || 'development'
dotenv.config()

const port = process.env.port //server port
const { Pool } = pkg

const openDb = () => {
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.NODE_ENV === "development" ? process.env.DB_NAME :
    process.env.TEST_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
    })
return pool
}

const pool = openDb()

export {pool}
*/
//______________________
/* MODULES EXPLAINED
- PG is used to access Postgres database from NodeJS app.
*/