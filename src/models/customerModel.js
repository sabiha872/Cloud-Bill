const db = require('../config/database');

const createCustomerProfile = async ({ userId, companyName, billingEmail, address, taxId }) => {
  const result = await db.query(
    `
      INSERT INTO customer_profiles (
        user_id,
        company_name,
        billing_email,
        address,
        tax_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [userId, companyName, billingEmail, address, taxId]
  );

  return result.rows[0];
};

const findCustomerProfileByUserId = async (userId) => {
  const result = await db.query(
    'SELECT * FROM customer_profiles WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

const updateCustomerProfile = async (userId, updates) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index += 1;
    }
  });

  if (fields.length === 0) {
    return findCustomerProfileByUserId(userId);
  }

  values.push(userId);
  const result = await db.query(
    `UPDATE customer_profiles SET ${fields.join(', ')} WHERE user_id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

module.exports = {
  createCustomerProfile,
  findCustomerProfileByUserId,
  updateCustomerProfile,
};
