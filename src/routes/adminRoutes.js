const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { listUsers } = require('../controllers/authController');

const router = express.Router();

router.use(authMiddleware, requireRole('ADMIN'));
router.get('/users', listUsers);

module.exports = router;
