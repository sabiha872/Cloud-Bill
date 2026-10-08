const db = require('../config/database');

const createSubscription = async ({ customerId, planId, status = 'ACTIVE', currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd = false, cancelledAt = null }) => {
  const result = await db.query(
    `
      INSERT INTO subscriptions (
        customer_id,
        plan_id,
        status,
        start_date,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        cancelled_at
      )
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)
      RETURNING *
    `,
    [customerId, planId, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, cancelledAt]
  );

  return result.rows[0];
};

const findSubscriptionById = async (id) => {
  const result = await db.query('SELECT * FROM subscriptions WHERE id = $1', [id]);
  return result.rows[0];
};

const listSubscriptionsByCustomer = async (customerId) => {
  const result = await db.query(
    'SELECT * FROM subscriptions WHERE customer_id = $1 ORDER BY created_at DESC',
    [customerId]
  );
  return result.rows;
};

const findActiveSubscriptionForCustomer = async (customerId) => {
  const result = await db.query(
    `
      SELECT * FROM subscriptions
      WHERE customer_id = $1 AND status = 'ACTIVE'
      ORDER BY current_period_start DESC
      LIMIT 1
    `,
    [customerId]
  );
  return result.rows[0];
};

const updateSubscription = async (id, updates) => {
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
    return findSubscriptionById(id);
  }

  values.push(id);
  const result = await db.query(
    `UPDATE subscriptions SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

module.exports = {
  createSubscription,
  findSubscriptionById,
  listSubscriptionsByCustomer,
  findActiveSubscriptionForCustomer,
  updateSubscription,
};
