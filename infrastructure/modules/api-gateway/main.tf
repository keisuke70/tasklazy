resource "aws_api_gateway_rest_api" "main" {
  name        = "myapp-api"
  description = "API for My Application"
}

#######################################
# /api/parse-task (for Gemini API calls)
#######################################
resource "aws_api_gateway_resource" "parse_task" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "parse-task"
}

resource "aws_api_gateway_method" "parse_task_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.parse_task.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "parse_task_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.parse_task.id
  http_method             = aws_api_gateway_method.parse_task_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.parse_task_lambda_arn
}

##############################################
# /api/generate-schedule (for internal DB operations)
##############################################
resource "aws_api_gateway_resource" "generate_schedule" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "generate-schedule"
}

resource "aws_api_gateway_method" "generate_schedule_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.generate_schedule.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "generate_schedule_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.generate_schedule.id
  http_method             = aws_api_gateway_method.generate_schedule_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.generate_schedule_lambda_arn
}

##############################################
# /api/update-task (for synchronous task updates)
##############################################
resource "aws_api_gateway_resource" "update_task" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "update-task"
}

resource "aws_api_gateway_method" "update_task_patch" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.update_task.id
  http_method   = "PATCH"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "update_task_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main.id
  resource_id             = aws_api_gateway_resource.update_task.id
  http_method             = aws_api_gateway_method.update_task_patch.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.update_task_lambda_arn
}
