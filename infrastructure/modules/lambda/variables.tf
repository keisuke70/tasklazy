variable "subnet_ids" {
  description = "List of subnet IDs for VPC Lambdas."
  type        = list(string)
}

variable "lambda_security_group_id" {
  description = "Security group ID for VPC Lambdas."
  type        = string
}

variable "db_secret_arn" {
  description = "The ARN of the database secret (from Secrets Manager)."
  type        = string
}

variable "gemini_api_key" {
  description = "API key for the Gemini API."
  type        = string
}

variable "sqs_gemini_results_url" {
  description = "The SQS queue URL to which the parse-task lambda will post the Gemini results."
  type        = string
}

variable "sqs_gemini_results_arn" {
  description = "The ARN of the SQS queue for Gemini results."
  type        = string
}

variable "db_connection_string" {
  description = "Connection string for Aurora DB"
  type        = string
}
