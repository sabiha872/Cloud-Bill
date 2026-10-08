const db = require('../config/database');

const createInvoice = async ({ customerId, subscriptionId, invoiceNumber, amount, currency, status = 'PENDING', dueDate }) => {
  const result = await db.query(
    `
      INSERT INTO invoices (
        customer_id,
        subscription_id,
        invoice_number,
        amount,
        currency,
        status,
        due_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [customerId, subscriptionId, invoiceNumber, amount, currency, status, dueDate]
  );

  return result.rows[0];
};

const findInvoiceById = async (id) => {
  const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
  return result.rows[0];
};

const listInvoicesByCustomer = async (customerId) => {
  const result = await db.query(
    'SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC',
    [customerId]
  );
  return result.rows;
};

const updateInvoice = async (id, updates) => {
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
    return findInvoiceById(id);
  }

  values.push(id);
  const result = await db.query(
    `UPDATE invoices SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

module.exports = {
  createInvoice,
  findInvoiceById,
  listInvoicesByCustomer,
  updateInvoice,
};
