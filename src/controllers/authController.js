const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const AppError = require('../utils/AppError');
const { createUser, findUserByEmail, findUserById, listUsers, comparePassword } = require('../models/userModel');
const { findCustomerProfileByUserId } = require('../models/customerModel');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) => jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  const user = await createUser({ name, email, password, role });
  const token = signToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  const profile = await findCustomerProfileByUserId(user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      customerProfile: profile || null,
    },
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json({ success: true, users });
});

module.exports = {
  register,
  login,
  me,
  listUsers,
};
