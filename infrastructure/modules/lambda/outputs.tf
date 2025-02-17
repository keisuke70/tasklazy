output "vpc_handler_arn" {
  description = "ARN of the VPC handler Lambda (for non‑Gemini API operations)."
  value       = aws_lambda_function.vpc_handler.arn
}

output "parse_task_handler_arn" {
  description = "ARN of the parse task handler Lambda (for /api/parse-task)."
  value       = aws_lambda_function.parse_task_handler.arn
}

output "update_task_lambda_arn" {
  description = "ARN of the update task handler Lambda (for /api/update-task)."
  value       = aws_lambda_function.update_task_handler.arn
}

output "db_update_handler_arn" {
  description = "ARN of the DB update handler Lambda (triggered by SQS)."
  value       = aws_lambda_function.db_update_handler.arn
}

output "db_init_handler_arn" {
  description = "ARN of the DB initialization Lambda."
  value       = aws_lambda_function.db_init_handler.arn
}
