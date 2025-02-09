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

#############################
# VPC Lambda: Internal Tasks
#############################
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
      DB_SECRET_ARN       = var.db_secret_arn
      OPENAI_REQUESTS_URL = var.openai_requests_url
      OPENAI_RESULTS_URL  = var.openai_results_url
    }
  }
}

#########################################
# Non-VPC Lambda: OpenAI Request Handler
#########################################
resource "aws_lambda_function" "openai_handler" {
  filename         = "${path.module}/../../../../packages/lambdas/openai-handler/dist/index.zip"
  function_name    = "openai-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  # Notice: no vpc_config block so it is Internet-accessible

  environment {
    variables = {
      OPENAI_API_KEY     = var.gemini_api_key
      OPENAI_RESULTS_URL = var.openai_results_url
    }
  }
}

##############################################################
# Event Source Mapping: Trigger non-VPC Lambda from SQS Queue
##############################################################
resource "aws_lambda_event_source_mapping" "openai_sqs_trigger" {
  event_source_arn = var.openai_requests_arn
  function_name    = aws_lambda_function.openai_handler.arn
  batch_size       = 10
  enabled          = true
}
