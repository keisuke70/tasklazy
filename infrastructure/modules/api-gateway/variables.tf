variable "parse_task_lambda_arn" {
  description = "ARN of the parse-task handler Lambda."
  type        = string
}

variable "generate_schedule_lambda_arn" {
  description = "ARN of the generate-schedule (VPC) Lambda."
  type        = string
}

variable "update_task_lambda_arn" {
  description = "ARN of the update-task handler Lambda."
  type        = string
}

variable "fetch_task_lambda_arn" {
  description = "ARN of the fetch-task handler Lambda (for /api/fetch-task)."
  type        = string
}
