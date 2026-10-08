-- Development-only seed data.
-- These credentials are for local testing only.

INSERT INTO users (id, name, email, password_hash, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'CloudBill Admin', 'admin@cloudbill.local', '$2a$10$7zvD2gQP0DwZ9VQ4bJ8bIu7zKQ7CR2j9fHfG4v4g7iXfD0bcx7rve', 'ADMIN'),
  ('22222222-2222-2222-2222-222222222222', 'CloudBill Customer', 'customer@cloudbill.local', '$2a$10$7zvD2gQP0DwZ9VQ4bJ8bIu7zKQ7CR2j9fHfG4v4g7iXfD0bcx7rve', 'CUSTOMER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (id, user_id, company_name, billing_email, address, tax_id)
VALUES
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'CloudBill Labs', 'billing@cloudbill.local', '123 Market Street', 'TAX-1001')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO plans (id, name, description, price, currency, billing_interval, features, active)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Starter', 'Best for early-stage teams', 29.00, 'USD', 'MONTHLY', '["1 workspace","Basic analytics","Email support"]', TRUE),
  ('55555555-5555-5555-5555-555555555555', 'Professional', 'For growing SaaS teams', 99.00, 'USD', 'MONTHLY', '["Unlimited workspaces","Advanced analytics","Priority support"]', TRUE),
  ('66666666-6666-6666-6666-666666666666', 'Enterprise', 'For larger organizations', 249.00, 'USD', 'MONTHLY', '["Custom integrations","SSO","Dedicated support"]', TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO subscriptions (id, customer_id, plan_id, status, start_date, current_period_start, current_period_end, cancel_at_period_end)
VALUES
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'ACTIVE', NOW(), NOW(), NOW() + INTERVAL '30 days', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, customer_id, subscription_id, invoice_number, amount, currency, status, due_date, paid_at)
VALUES
  ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'INV-1001', 99.00, 'USD', 'PENDING', NOW() + INTERVAL '7 days', NULL)
ON CONFLICT (invoice_number) DO NOTHING;
