const { createPlan, listPlans, findPlanById, updatePlan, deletePlan } = require('../models/planModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const createPlanHandler = asyncHandler(async (req, res) => {
  const { name, description, price, currency, billing_interval, features, active } = req.body;

  if (!name || !price || !billing_interval) {
    throw new AppError('Plan name, price and billing interval are required', 400);
  }

  const plan = await createPlan({
    name,
    description,
    price,
    currency: currency || 'USD',
    billing_interval,
    features: features || [],
    active: active !== undefined ? active : true,
  });

  res.status(201).json({ success: true, plan });
});

const getPlans = asyncHandler(async (req, res) => {
  const plans = await listPlans(req.user && req.user.role === 'ADMIN');
  res.json({ success: true, plans });
});

const getPlanById = asyncHandler(async (req, res) => {
  const plan = await findPlanById(req.params.id);
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }

  res.json({ success: true, plan });
});

const updatePlanHandler = asyncHandler(async (req, res) => {
  const plan = await updatePlan(req.params.id, req.body);
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }

  res.json({ success: true, plan });
});

const deletePlanHandler = asyncHandler(async (req, res) => {
  const plan = await deletePlan(req.params.id);
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }

  res.json({ success: true, message: 'Plan deleted successfully' });
});

module.exports = {
  createPlanHandler,
  getPlans,
  getPlanById,
  updatePlanHandler,
  deletePlanHandler,
};
