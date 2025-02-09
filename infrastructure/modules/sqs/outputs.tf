output "openai_requests_url" {
  description = "URL of the openai-requests SQS queue"
  value       = aws_sqs_queue.openai_requests.id
}

output "openai_results_url" {
  description = "URL of the openai-results SQS queue"
  value       = aws_sqs_queue.openai_results.id
}

output "openai_requests_arn" {
  description = "ARN of the openai-requests SQS queue"
  value       = aws_sqs_queue.openai_requests.arn
}
