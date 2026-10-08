require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),
  JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://cloudbill:cloudbillpass@localhost:5432/cloudbill',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://cloudbill:cloudbillpass@localhost:5432/cloudbill_test',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
