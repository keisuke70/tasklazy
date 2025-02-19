terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_cognito_user_pool" "this" {
  name = var.user_pool_name

  auto_verified_attributes = var.auto_verified_attributes
  mfa_configuration        = var.mfa_configuration

  password_policy {
    minimum_length    = var.password_minimum_length
    require_uppercase = var.password_require_uppercase
    require_lowercase = var.password_require_lowercase
    require_numbers   = var.password_require_numbers
    require_symbols   = var.password_require_symbols
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = var.user_pool_client_name
  user_pool_id = aws_cognito_user_pool.this.id

  explicit_auth_flows    = var.explicit_auth_flows
  generate_secret        = var.generate_secret
  refresh_token_validity = var.refresh_token_validity
}
