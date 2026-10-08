const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel', () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  listUsers: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../models/customerModel', () => ({
  findCustomerProfileByUserId: jest.fn(),
}));

const app = require('../app');
const { JWT_SECRET } = require('../config/env');
const { createUser, findUserByEmail, findUserById, comparePassword } = require('../models/userModel');
const { findCustomerProfileByUserId } = require('../models/customerModel');

describe('Authentication endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user successfully', async () => {
    findUserByEmail.mockResolvedValue(null);
    createUser.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'CUSTOMER',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'pass1234',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('alice@example.com');
    expect(response.body.token).toBeTruthy();
  });

  it('rejects invalid login credentials', async () => {
    findUserByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      password_hash: 'hashed-password',
      role: 'CUSTOMER',
    });
    comparePassword.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'wrong-password',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('returns the current authenticated user', async () => {
    const token = jwt.sign({ userId: 'user-1', role: 'CUSTOMER' }, JWT_SECRET, { expiresIn: '1h' });

    findUserById.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'CUSTOMER',
    });
    findCustomerProfileByUserId.mockResolvedValue({
      id: 'profile-1',
      user_id: 'user-1',
      company_name: 'Acme Inc.',
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('alice@example.com');
    expect(response.body.user.customerProfile.company_name).toBe('Acme Inc.');
  });
});
