const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { DATABASE_URL } = require('../src/config/env');

const pool = new Pool({ connectionString: DATABASE_URL });

async function initDatabase() {
  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_init_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    await pool.query(sql);

    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDatabase();
