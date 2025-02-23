module "networking" {
  source = "../../modules/networking"
}

module "aurora" {
  source               = "../../modules/aurora"
  private_subnet_ids   = module.networking.private_subnet_ids
  db_security_group_id = module.networking.db_security_group_id
}

module "sqs" {
  source = "../../modules/sqs"
}

module "api_gateway" {
  source = "../../modules/api-gateway"
  parse_task_lambda_arn        = module.lambda.parse_task_handler_arn
  generate_schedule_lambda_arn = module.lambda.vpc_handler_arn
  update_task_lambda_arn       = module.lambda.update_task_handler_arn
  fetch_task_lambda_arn        = module.lambda.fetch_task_handler_arn
}

module "lambda" {
  source                    = "../../modules/lambda"
  subnet_ids                = module.networking.private_subnet_ids
  lambda_security_group_id  = module.networking.lambda_security_group_id
  db_connection_string      = module.aurora.db_connection_string
  gemini_api_key            = var.gemini_api_key  
  sqs_gemini_results_url    = module.sqs.sqs_gemini_results_url
  sqs_gemini_results_arn    = module.sqs.sqs_gemini_results_arn
  api_gateway_execution_arn = module.api_gateway.execution_arn
}
