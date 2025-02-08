output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "db_security_group_id" {
  description = "The ID of the security group for the database"
  value       = aws_security_group.db.id
}

output "lambda_security_group_id" {
  description = "The ID of the lambda security group"
  value       = aws_security_group.lambda.id
}
