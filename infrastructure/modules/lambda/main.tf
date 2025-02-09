resource "aws_iam_role" "lambda_exec" {
  name = "lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

###########################################
# VPC Handler – For simple DB operations
###########################################
resource "aws_lambda_function" "vpc_handler" {
  filename         = "${path.module}/../../../../packages/lambdas/vpc-handler/dist/index.zip"
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
      DB_SECRET_ARN = var.db_secret_arn
    }
  }
}

#########################################################
# Parse Task Handler – Non-VPC Lambda for Gemini API call
#########################################################
resource "aws_lambda_function" "parse_task_handler" {
  filename         = "${path.module}/../../../../packages/lambdas/parse-task-handler/dist/index.zip"
  function_name    = "parse-task-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  # No vpc_config block so it is Internet-accessible

  environment {
    variables = {
      GEMINI_API_KEY         = var.gemini_api_key
      SQS_GEMINI_RESULTS_URL = var.sqs_gemini_results_url
    }
  }
}

#####################################################
# DB Update Handler – VPC Lambda triggered by SQS
#####################################################
resource "aws_lambda_function" "db_update_handler" {
  filename         = "${path.module}/../../../../packages/lambdas/db-update-handler/dist/index.zip"
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
      DB_SECRET_ARN = var.db_secret_arn
    }
  }
}

#####################################################################
# Event Source Mapping: Trigger DB Update Handler from SQS Queue
#####################################################################
resource "aws_lambda_event_source_mapping" "gemini_results_trigger" {
  event_source_arn = var.sqs_gemini_results_arn
  function_name    = aws_lambda_function.db_update_handler.arn
  batch_size       = 10
  enabled          = true
}
