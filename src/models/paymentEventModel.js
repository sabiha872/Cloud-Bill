const db = require('../config/database');

const createPaymentEvent = async ({ invoiceId, eventType, status, metadata = {} }) => {
  const result = await db.query(
    `
      INSERT INTO payment_events (
        invoice_id,
        event_type,
        status,
        metadata
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [invoiceId, eventType, status, JSON.stringify(metadata)]
  );

  return result.rows[0];
};

const listPaymentEventsByInvoice = async (invoiceId) => {
  const result = await db.query(
    'SELECT * FROM payment_events WHERE invoice_id = $1 ORDER BY created_at DESC',
    [invoiceId]
  );
  return result.rows;
};

module.exports = {
  createPaymentEvent,
  listPaymentEventsByInvoice,
};
