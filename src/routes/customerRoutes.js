const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/customerController');

const router = express.Router();

router.use(authMiddleware, requireRole('CUSTOMER'));
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

module.exports = router;
