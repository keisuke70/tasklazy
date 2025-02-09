output "vpc_handler_arn" {
  description = "ARN of the VPC Lambda handler"
  value       = aws_lambda_function.vpc_handler.arn
}
