const db = require('../config/database');

const createPlan = async ({ name, description, price, currency, billing_interval, features, active = true }) => {
  const result = await db.query(
    `
      INSERT INTO subscription_plans (
        name,
        description,
        price,
        currency,
        billing_interval,
        features,
        active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [name, description, price, currency, billing_interval, JSON.stringify(features || []), active]
  );

  return result.rows[0];
};

const listPlans = async (includeInactive = false) => {
  const query = includeInactive
    ? 'SELECT * FROM subscription_plans ORDER BY created_at DESC'
    : 'SELECT * FROM subscription_plans WHERE active = true ORDER BY created_at DESC';

  const result = await db.query(query);
  return result.rows;
};

const findPlanById = async (id) => {
  const result = await db.query('SELECT * FROM subscription_plans WHERE id = $1', [id]);
  return result.rows[0];
};

const updatePlan = async (id, updates) => {
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
    return findPlanById(id);
  }

  values.push(id);
  const result = await db.query(
    `UPDATE subscription_plans SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

const deletePlan = async (id) => {
  const result = await db.query('DELETE FROM subscription_plans WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createPlan,
  listPlans,
  findPlanById,
  updatePlan,
  deletePlan,
};
