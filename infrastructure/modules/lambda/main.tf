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

# Fetch Task Handler – VPC Lambda to retrieve tasks for a given user.
resource "aws_lambda_function" "fetch_task_handler" {
  filename         = "${path.module}/../../../packages/lambdas/fetch-task-handler/dist/index.zip"
  function_name    = "fetch-task-handler"
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
  source_code_hash = filebase64sha256("${path.module}/../../../packages/lambdas/fetch-task-handler/dist/index.zip")
}


# Lambda permission to allow API Gateway to invoke the parse-task handler.
resource "aws_lambda_permission" "allow_api_gateway_parse_task" {
  statement_id  = "AllowAPIGatewayInvokeParseTask"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.parse_task_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/POST/parse-task"
}

# Lambda permission to allow API Gateway to invoke the vpc handler (for generate-schedule).
resource "aws_lambda_permission" "allow_api_gateway_generate_schedule" {
  statement_id  = "AllowAPIGatewayInvokeGenerateSchedule"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.vpc_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/POST/generate-schedule"
}

# Lambda permission to allow API Gateway to invoke the update-task handler.
resource "aws_lambda_permission" "allow_api_gateway_update_task" {
  statement_id  = "AllowAPIGatewayInvokeUpdateTask"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_task_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/PATCH/update-task"
}

# Lambda permission to allow API Gateway to invoke the fetch-task handler.
resource "aws_lambda_permission" "allow_api_gateway_fetch_task" {
  statement_id  = "AllowAPIGatewayInvokeFetchTask"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fetch_task_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/GET/fetch-task"
}

# Event Source Mapping: Trigger DB Update Handler from SQS Queue
resource "aws_lambda_event_source_mapping" "gemini_results_trigger" {
  event_source_arn = var.sqs_gemini_results_arn
  function_name    = aws_lambda_function.db_update_handler.arn
  batch_size       = 10
  enabled          = true
}
