const { Pool } = require('pg');
const { DATABASE_URL, TEST_DATABASE_URL, NODE_ENV } = require('./env');

const connectionString = NODE_ENV === 'test' ? TEST_DATABASE_URL || DATABASE_URL : DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error', err);
});

const testConnection = async () => {
  const result = await pool.query('SELECT 1 AS ok');
  return result.rows[0]?.ok === 1;
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection,
};
