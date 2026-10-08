const { v4: uuidv4 } = require('uuid');
const { findCustomerProfileByUserId } = require('../models/customerModel');
const { findPlanById, listPlans } = require('../models/planModel');
const {
  createSubscription,
  findSubscriptionById,
  listSubscriptionsByCustomer,
  findActiveSubscriptionForCustomer,
  updateSubscription,
} = require('../models/subscriptionModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const createSubscriptionHandler = asyncHandler(async (req, res) => {
  const profile = await findCustomerProfileByUserId(req.user.id);
  if (!profile) {
    throw new AppError('Customer profile required before creating a subscription', 400);
  }

  const { plan_id } = req.body;
  const plan = await findPlanById(plan_id);
  if (!plan || !plan.active) {
    throw new AppError('Selected plan is invalid or inactive', 400);
  }

  const activeSubscription = await findActiveSubscriptionForCustomer(profile.id);
  if (activeSubscription) {
    throw new AppError('Customer already has an active subscription', 409);
  }

  const start = new Date();
  const currentPeriodStart = new Date(start);
  const currentPeriodEnd = new Date(start);
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

  const subscription = await createSubscription({
    customerId: profile.id,
    planId: plan.id,
    status: 'ACTIVE',
    currentPeriodStart,
    currentPeriodEnd,
  });

  res.status(201).json({ success: true, subscription });
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const profile = await findCustomerProfileByUserId(req.user.id);
  if (!profile) {
    throw new AppError('Customer profile not found', 404);
  }

  const subscriptions = await listSubscriptionsByCustomer(profile.id);
  res.json({ success: true, subscriptions });
});

const getSubscriptionById = asyncHandler(async (req, res) => {
  const profile = await findCustomerProfileByUserId(req.user.id);
  const subscription = await findSubscriptionById(req.params.id);

  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  if (req.user.role !== 'ADMIN' && subscription.customer_id !== profile.id) {
    throw new AppError('You are not allowed to access this subscription', 403);
  }

  res.json({ success: true, subscription });
});

const modifySubscription = asyncHandler(async (req, res, action) => {
  const profile = await findCustomerProfileByUserId(req.user.id);
  const subscription = await findSubscriptionById(req.params.id);

  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  if (req.user.role !== 'ADMIN' && subscription.customer_id !== profile.id) {
    throw new AppError('You are not allowed to modify this subscription', 403);
  }

  if (action === 'cancel') {
    const updated = await updateSubscription(subscription.id, {
      status: req.body.cancel_at_period_end ? 'ACTIVE' : 'CANCELLED',
      cancel_at_period_end: !!req.body.cancel_at_period_end,
      cancelled_at: req.body.cancel_at_period_end ? null : new Date(),
    });
    return res.json({ success: true, subscription: updated });
  }

  if (action === 'renew') {
    const newPeriodStart = new Date(subscription.current_period_end || new Date());
    const newPeriodEnd = new Date(newPeriodStart);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

    const updated = await updateSubscription(subscription.id, {
      status: 'ACTIVE',
      current_period_start: newPeriodStart,
      current_period_end: newPeriodEnd,
      cancel_at_period_end: false,
      cancelled_at: null,
    });
    return res.json({ success: true, subscription: updated });
  }

  if (action === 'upgrade' || action === 'downgrade') {
    const { plan_id } = req.body;
    const targetPlan = await findPlanById(plan_id);
    if (!targetPlan || !targetPlan.active) {
      throw new AppError('Target plan is invalid or inactive', 400);
    }

    const updated = await updateSubscription(subscription.id, {
      plan_id: targetPlan.id,
      status: 'ACTIVE',
    });
    return res.json({ success: true, subscription: updated });
  }

  throw new AppError('Unsupported subscription action', 400);
});

const upgradeSubscription = asyncHandler(async (req, res) => {
  await modifySubscription(req, res, 'upgrade');
});

const downgradeSubscription = asyncHandler(async (req, res) => {
  await modifySubscription(req, res, 'downgrade');
});

const cancelSubscription = asyncHandler(async (req, res) => {
  await modifySubscription(req, res, 'cancel');
});

const renewSubscription = asyncHandler(async (req, res) => {
  await modifySubscription(req, res, 'renew');
});

module.exports = {
  createSubscriptionHandler,
  getSubscriptions,
  getSubscriptionById,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  renewSubscription,
};
