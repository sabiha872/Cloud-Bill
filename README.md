# CloudBill

CloudBill is a cloud-native SaaS subscription and billing platform built with Node.js, Express.js, PostgreSQL, Redis, and JWT-based auth.

## Features

- User registration and login with password hashing
- Role-based access control for ADMIN and CUSTOMER roles
- Subscription plan management
- Customer profiles
- Subscription lifecycle management with upgrade, downgrade, cancel, and renew flows
- Invoice generation and payment tracking
- Redis-based caching and background processing placeholders
- Swagger/OpenAPI API docs
- Docker Compose for local PostgreSQL and Redis services
- Jest and Supertest-based test setup

## Quick start

1. Install dependencies:
   npm install
2. Start PostgreSQL and Redis locally:
   docker compose up -d
3. Copy environment file:
   cp .env.example .env
4. Update the values in .env if needed.
5. Run the app:
   npm run dev

## Project structure

- `src/app.js` – Express app configuration
- `src/server.js` – Server bootstrap
- `src/config` – environment, logger, database, Redis config
- `src/middleware` – auth, error handling, validation
- `src/routes` – API endpoints
- `src/controllers` – route logic
- `src/services` – business logic
- `src/models` – database access helpers
- `src/utils` – helper functions
- `src/tests` – integration tests

## API docs

- Swagger UI: http://localhost:3000/api-docs
- Health check: http://localhost:3000/health

## Deployment notes

This project is designed to run locally with Docker Compose and can be deployed to AWS with a managed PostgreSQL instance and ElastiCache/Redis service.
