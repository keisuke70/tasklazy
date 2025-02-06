CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE repeat_option AS ENUM ('None', 'Daily', 'Weekly', 'Monthly');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255)
);

-- Add other tables from your schema