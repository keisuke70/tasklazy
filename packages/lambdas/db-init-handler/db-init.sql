-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Define the ENUM type for repeat options
CREATE TYPE repeat_option AS ENUM ('None', 'Daily', 'Weekly', 'Monthly');

-- Optional users table for storing additional business data.
CREATE TABLE users (
  id UUID PRIMARY KEY,  -- This will be the Cognito "sub"
  -- name VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255)
);


CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- This should match the Cognito user id ("sub")
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  due_date DATE,
  reminder_time TIMESTAMPTZ,
  repeat_rule repeat_option NOT NULL DEFAULT 'None',
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  priority INT,
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
