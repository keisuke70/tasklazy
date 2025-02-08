# lambda/main.tf
resource "aws_iam_role" "lambda_exec" {
  name = "lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_lambda_function" "create_user" {
  filename      = "${path.module}/../../../../packages/lambdas/create-user/dist/index.zip"
  function_name = "create-user"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  
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