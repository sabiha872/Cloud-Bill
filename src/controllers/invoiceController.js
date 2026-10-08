const { findCustomerProfileByUserId } = require('../models/customerModel');
const { findInvoiceById, listInvoicesByCustomer, updateInvoice } = require('../models/invoiceModel');
const { createPaymentEvent } = require('../models/paymentEventModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getInvoices = asyncHandler(async (req, res) => {
  const profile = await findCustomerProfileByUserId(req.user.id);
  if (!profile) {
    throw new AppError('Customer profile not found', 404);
  }

  const invoices = await listInvoicesByCustomer(profile.id);
  res.json({ success: true, invoices });
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await findInvoiceById(req.params.id);
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  const profile = await findCustomerProfileByUserId(req.user.id);
  if (req.user.role !== 'ADMIN' && invoice.customer_id !== profile.id) {
    throw new AppError('You are not allowed to access this invoice', 403);
  }

  res.json({ success: true, invoice });
});

const payInvoice = asyncHandler(async (req, res) => {
  const invoice = await findInvoiceById(req.params.id);
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  const profile = await findCustomerProfileByUserId(req.user.id);
  if (req.user.role !== 'ADMIN' && invoice.customer_id !== profile.id) {
    throw new AppError('You are not allowed to pay this invoice', 403);
  }

  const updatedInvoice = await updateInvoice(invoice.id, {
    status: 'PAID',
    paid_at: new Date(),
  });

  await createPaymentEvent({
    invoiceId: invoice.id,
    eventType: 'payment_success',
    status: 'PAID',
    metadata: { amount: invoice.amount, currency: invoice.currency },
  });

  res.json({ success: true, invoice: updatedInvoice });
});

const voidInvoice = asyncHandler(async (req, res) => {
  const invoice = await findInvoiceById(req.params.id);
  if (!invoice) {
    throw new AppError('Invoice not found', 404);
  }

  const profile = await findCustomerProfileByUserId(req.user.id);
  if (req.user.role !== 'ADMIN' && invoice.customer_id !== profile.id) {
    throw new AppError('You are not allowed to void this invoice', 403);
  }

  const updatedInvoice = await updateInvoice(invoice.id, {
    status: 'VOID',
  });

  await createPaymentEvent({
    invoiceId: invoice.id,
    eventType: 'invoice_voided',
    status: 'VOID',
    metadata: { reason: 'Void requested by user' },
  });

  res.json({ success: true, invoice: updatedInvoice });
});

module.exports = {
  getInvoices,
  getInvoiceById,
  payInvoice,
  voidInvoice,
};
