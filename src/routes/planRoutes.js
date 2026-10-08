const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { createPlanHandler, getPlans, getPlanById, updatePlanHandler, deletePlanHandler } = require('../controllers/planController');

const router = express.Router();

router.get('/', authMiddleware, getPlans);
router.post('/', authMiddleware, requireRole('ADMIN'), createPlanHandler);
router.get('/:id', authMiddleware, getPlanById);
router.patch('/:id', authMiddleware, requireRole('ADMIN'), updatePlanHandler);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), deletePlanHandler);

module.exports = router;
