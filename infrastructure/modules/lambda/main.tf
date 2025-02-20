
# VPC Handler – For simple DB operations (e.g. generating schedule via DB queries)
resource "aws_lambda_function" "vpc_handler" {
  filename         = "${path.module}/../../../packages/lambdas/vpc-handler/dist/index.zip"
  function_name    = "vpc-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  environment {
    variables = {
      DB_CONNECTION_STRING = var.db_connection_string
    }
  }
  # Compute a base64-encoded SHA256 hash of the zip file to force an update when code changes
  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/vpc-handler/dist/index.zip")
}

# Parse Task Handler – Non-VPC Lambda for Gemini API call
resource "aws_lambda_function" "parse_task_handler" {
  filename         = "${path.module}/../../../packages/lambdas/parse-task-handler/dist/index.zip"
  function_name    = "parse-task-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  
  environment {
    variables = {
      GEMINI_API_KEY         = var.gemini_api_key
      SQS_GEMINI_RESULTS_URL = var.sqs_gemini_results_url
    }
  }

  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/parse-task-handler/dist/index.zip")
}

# DB Update Handler – VPC Lambda triggered by SQS
resource "aws_lambda_function" "db_update_handler" {
  filename         = "${path.module}/../../../packages/lambdas/db-update-handler/dist/index.zip"
  function_name    = "db-update-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  environment {
    variables = {
      DB_CONNECTION_STRING = var.db_connection_string
    }
  }

  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/db-update-handler/dist/index.zip")
}

# Update Task Handler – VPC Lambda for synchronous task updates
resource "aws_lambda_function" "update_task_handler" {
  filename         = "${path.module}/../../../packages/lambdas/update-task-handler/dist/index.zip"
  function_name    = "update-task-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }
  
  environment {
    variables = {
      DB_CONNECTION_STRING = var.db_connection_string
    }
  }

  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/update-task-handler/dist/index.zip")
}

# DB Initialization Handler – VPC Lambda to run db-init.sql
resource "aws_lambda_function" "db_init_handler" {
  filename         = "${path.module}/../../../packages/lambdas/db-init-handler/dist/index.zip"
  function_name    = "db-init-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }
  
  environment {
    variables = {
      DB_CONNECTION_STRING = var.db_connection_string
    }
  }

  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/db-init-handler/dist/index.zip")
}

# Event Source Mapping: Trigger DB Update Handler from SQS Queue
resource "aws_lambda_event_source_mapping" "gemini_results_trigger" {
  event_source_arn = var.sqs_gemini_results_arn
  function_name    = aws_lambda_function.db_update_handler.arn
  batch_size       = 10
  enabled          = true
}
