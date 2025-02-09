output "sqs_gemini_results_url" {
  description = "URL of the Gemini results SQS queue"
  value       = aws_sqs_queue.gemini_results.id
}

output "sqs_gemini_results_arn" {
  description = "ARN of the Gemini results SQS queue"
  value       = aws_sqs_queue.gemini_results.arn
}
