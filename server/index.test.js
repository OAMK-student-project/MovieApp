import 'dotenv/config' // load .env before anything else

import { expect } from 'chai'
import { pool } from './helpers/db.js'
import { initializeTestDb, clearDb, insertTestUser } from './helpers/test.js'

// Use function() syntax to access this.timeout()
describe('Database tests', function () {
  this.timeout(10000) // 10 seconds for DB setup

  const testUser = {
    email: 'foo@foo.com',
    password_hash: 'password123',
    firstname: 'Foo',
    lastname: 'Bar'
  }

  before(async function () {
    // confirm connection
    const { rows } = await pool.query('SELECT current_database(), current_user')
    console.log('Connected to DB:', rows[0])

    await initializeTestDb()
  })

  beforeEach(async () => {
    await clearDb()
  })

  after(async () => {
    await clearDb()
    await pool.end()   // close connections
  })

  it('should insert and retrieve a user', async () => {
    const inserted = await insertTestUser(testUser)

    const { rows } = await pool.query(
      'SELECT id, email, password_hash FROM "Users" WHERE email = $1',
      [testUser.email]
    )

    expect(rows.length).to.equal(1)
    expect(rows[0].email).to.equal(inserted.email)
    expect(rows[0].password_hash).to.equal(testUser.password_hash)
  })

  it('should delete a user', async () => {
    // 1. Insert test user
    const inserted = await insertTestUser(testUser)

    // 2. Delete that user
    const { rows: deletedRows } = await pool.query(
      'DELETE FROM "Users" WHERE id = $1 RETURNING *',
      [inserted.id]
    )

    expect(deletedRows.length).to.equal(1)
    expect(deletedRows[0].id).to.equal(inserted.id)

    // 3. Confirm user is no longer in DB
    const { rows: checkRows } = await pool.query(
      'SELECT id FROM "Users" WHERE id = $1',
      [inserted.id]
    )

    expect(checkRows.length).to.equal(0)
  })

})
