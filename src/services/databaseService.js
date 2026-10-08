const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const migrationPath = path.join(__dirname, '..', '..', 'migrations', '001_init_schema.sql');

const checkDatabaseConnection = async () => {
  const connected = await db.testConnection();
  return connected;
};

const initDatabase = async () => {
  const sql = fs.readFileSync(migrationPath, 'utf8');
  await db.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
  await db.query(sql);
};

module.exports = {
  checkDatabaseConnection,
  initDatabase,
};
