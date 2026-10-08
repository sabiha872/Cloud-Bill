const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const {
  createSubscriptionHandler,
  getSubscriptions,
  getSubscriptionById,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  renewSubscription,
} = require('../controllers/subscriptionController');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createSubscriptionHandler);
router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);
router.post('/:id/upgrade', upgradeSubscription);
router.post('/:id/downgrade', downgradeSubscription);
router.post('/:id/cancel', cancelSubscription);
router.post('/:id/renew', renewSubscription);

module.exports = router;
