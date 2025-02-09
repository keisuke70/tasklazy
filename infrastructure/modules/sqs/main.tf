resource "aws_sqs_queue" "openai_requests" {
  name                        = "openai-requests"
  visibility_timeout_seconds  = 30
}

resource "aws_sqs_queue" "openai_results" {
  name                        = "openai-results"
  visibility_timeout_seconds  = 30
}
