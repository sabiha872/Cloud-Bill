const db = require('../config/database');
const bcrypt = require('bcryptjs');

const createUser = async ({ name, email, password, role = 'CUSTOMER' }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email.toLowerCase(), passwordHash, role]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const listUsers = async () => {
  const result = await db.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

const comparePassword = async (providedPassword, storedHash) => {
  return bcrypt.compare(providedPassword, storedHash);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  comparePassword,
};
