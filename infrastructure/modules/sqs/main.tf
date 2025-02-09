resource "aws_sqs_queue" "gemini_results" {
  name                       = "gemini-results"
  visibility_timeout_seconds = 30
}
