variable "subnet_ids" {
  description = "List of subnet IDs in which the Lambda function will be deployed."
  type        = list(string)
}

variable "lambda_security_group_id" {
  description = "Security group ID for the Lambda function."
  type        = string
}

variable "db_secret_arn" {
  description = "The ARN of the database secret (from Secrets Manager) used by the Lambda function."
  type        = string
}
