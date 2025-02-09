output "vpc_handler_arn" {
  description = "ARN of the VPC handler Lambda (for non-Gemini API operations)."
  value       = aws_lambda_function.vpc_handler.arn
}

output "parse_task_handler_arn" {
  description = "ARN of the parse task handler Lambda (for /api/parse-task)."
  value       = aws_lambda_function.parse_task_handler.arn
}
