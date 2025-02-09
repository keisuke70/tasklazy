variable "subnet_ids" {
  description = "List of subnet IDs in which the VPC Lambda function will be deployed."
  type        = list(string)
}

variable "lambda_security_group_id" {
  description = "Security group ID for the VPC Lambda function."
  type        = string
}

variable "db_secret_arn" {
  description = "The ARN of the database secret used by the VPC Lambda function."
  type        = string
}

variable "openai_requests_url" {
  description = "URL for the openai-requests SQS queue."
  type        = string
}

variable "openai_results_url" {
  description = "URL for the openai-results SQS queue."
  type        = string
}

variable "gemini_api_key" {
  description = "The API key for accessing gemini."
  type        = string
}

variable "openai_requests_arn" {
  description = "ARN of the openai-requests SQS queue."
  type        = string
}
