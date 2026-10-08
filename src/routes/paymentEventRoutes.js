const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getPaymentEvents } = require('../controllers/paymentEventController');

const router = express.Router();

router.use(authMiddleware);
router.get('/invoice/:invoiceId', getPaymentEvents);

module.exports = router;
