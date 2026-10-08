const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getInvoices, getInvoiceById, payInvoice, voidInvoice } = require('../controllers/invoiceController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/:id/pay', payInvoice);
router.post('/:id/void', voidInvoice);

module.exports = router;
