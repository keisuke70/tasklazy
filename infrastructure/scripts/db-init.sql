-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Define the ENUM type for repeat options
CREATE TYPE repeat_option AS ENUM ('None', 'Daily', 'Weekly', 'Monthly');

-- Create the users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255)
);

-- Create the tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  due_date DATE,
  reminder_time TIMESTAMPTZ,
  repeat_rule repeat_option NOT NULL DEFAULT 'None',
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the scheduled_blocks table
CREATE TABLE scheduled_blocks (
  id SERIAL PRIMARY KEY,
  task_id UUID NOT NULL,
  schedule_date DATE NOT NULL,
  start_time TIME NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
