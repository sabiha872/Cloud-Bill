const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { DATABASE_URL } = require('../src/config/env');

const pool = new Pool({ connectionString: DATABASE_URL });

async function seed() {
  try {
    const seedPath = path.join(__dirname, '..', 'seeds', '001_dev_seed.sql');
    const sql = fs.readFileSync(seedPath, 'utf8');

    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('customer123', 10);

    await pool.query(sql, []);

    await pool.query(
      `
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING;
      `,
      ['11111111-1111-1111-1111-111111111111', 'CloudBill Admin', 'admin@cloudbill.local', adminHash, 'ADMIN']
    );

    await pool.query(
      `
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING;
      `,
      ['22222222-2222-2222-2222-222222222222', 'CloudBill Customer', 'customer@cloudbill.local', customerHash, 'CUSTOMER']
    );

    console.log('Development seed data inserted successfully.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
