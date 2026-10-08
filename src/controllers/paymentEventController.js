const { listPaymentEventsByInvoice } = require('../models/paymentEventModel');
const { findInvoiceById } = require('../models/invoiceModel');
const { findCustomerProfileByUserId } = require('../models/customerModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getPaymentEvents = asyncHandler(async (req, res) => {
  const invoice = await findInvoiceById(req.params.invoiceId);
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  const profile = await findCustomerProfileByUserId(req.user.id);
  if (req.user.role !== 'ADMIN' && invoice.customer_id !== profile.id) {
    throw new AppError('You are not allowed to view payment events for this invoice', 403);
  }

  const events = await listPaymentEventsByInvoice(invoice.id);
  res.json({ success: true, events });
});

module.exports = {
  getPaymentEvents,
};
