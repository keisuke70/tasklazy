terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_amplify_app" "this" {
  name                 = var.app_name
  repository           = var.repository
  build_spec           = var.build_spec
  environment_variables = var.environment_variables
  description          = var.description

  // Optional: add custom rules if needed
  dynamic "custom_rules" {
    for_each = var.custom_rules
    content {
      source = custom_rules.value.source
      target = custom_rules.value.target
      status = custom_rules.value.status
    }
  }
}
