
module "networking" {
  source = "../../modules/networking"
}

module "aurora" {
  source               = "../../modules/aurora"
  vpc_id               = module.networking.vpc_id
  private_subnet_ids   = module.networking.private_subnet_ids
  db_security_group_id = module.networking.db_security_group_id
}

module "sqs" {
  source = "../../modules/sqs"
}

module "lambda" {
  source                   = "../../modules/lambda"
  subnet_ids               = module.networking.private_subnet_ids
  lambda_security_group_id = module.networking.lambda_security_group_id
  db_connection_string     = module.aurora.db_connection_string
  gemini_api_key           = var.gemini_api_key  
  sqs_gemini_results_url   = module.sqs.sqs_gemini_results_url
  sqs_gemini_results_arn   = module.sqs.sqs_gemini_results_arn
}

module "api_gateway" {
  source = "../../modules/api-gateway"
  parse_task_lambda_arn        = module.lambda.parse_task_handler_arn
  generate_schedule_lambda_arn = module.lambda.vpc_handler_arn
  update_task_lambda_arn       = module.lambda.update_task_handler_arn
}


module "cognito" {
  source                  = "../../modules/cognito"
  user_pool_name          = "my-cognito-userpool"
  user_pool_client_name   = "my-userpool-client"
  auto_verified_attributes = ["email"]
  mfa_configuration       = "OFF"
  password_minimum_length = 8
  password_require_uppercase = true
  password_require_lowercase = true
  password_require_numbers   = true
  password_require_symbols   = false
  explicit_auth_flows     = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
  generate_secret         = false
  refresh_token_validity  = 30
}

module "amplify" {
  source = "../../modules/amplify"

  app_name     = "my-amplify-app"
  repository   = "https://github.com/keisuke70/tasklazy"
  build_spec   = file("amplify-buildspec.yml")
  environment_variables = {
    NEXT_PUBLIC_COGNITO_USER_POOL_ID        = module.cognito.user_pool_id
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = module.cognito.user_pool_client_id
  }
  description  = "Amplify Gen2 app for my Next.js project"
  custom_rules = []
}
