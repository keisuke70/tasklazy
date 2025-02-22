output "execution_arn" {
  description = "The execution ARN for API Gateway used to allow Lambda invocations"
  value       = aws_api_gateway_rest_api.main.execution_arn
}
