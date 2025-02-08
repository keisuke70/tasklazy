variable "private_subnet_ids" {
  description = "List of private subnet IDs where the Aurora cluster will be deployed."
  type        = list(string)
}

variable "db_security_group_id" {
  description = "The security group ID that allows access to the Aurora database."
  type        = string
}

# Optional: if you plan to use it later in this module.
variable "vpc_id" {
  description = "The VPC ID for the Aurora cluster."
  type        = string
}
