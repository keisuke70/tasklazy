output "amplify_app_id" {
  description = "The ID of the Amplify app"
  value       = aws_amplify_app.this.app_id
}

output "amplify_app_arn" {
  description = "The ARN of the Amplify app"
  value       = aws_amplify_app.this.arn
}
