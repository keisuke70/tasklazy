# environments/dev/main.tf
module "networking" {
  source = "../../modules/networking"
}

module "aurora" {
  source               = "../../modules/aurora"
  vpc_id               = module.networking.vpc_id
  private_subnet_ids   = module.networking.private_subnet_ids
  db_security_group_id = module.networking.db_security_group_id
}


# module "sqs" {
#   source = "../../modules/sqs"
# }


# module "lambda" {
#   source                   = "../../modules/lambda"
#   subnet_ids               = module.networking.private_subnet_ids
#   lambda_security_group_id = module.networking.lambda_security_group_id
#   db_secret_arn            = module.aurora.db_secret_arn
#   gemini_api_key           = var.gemini_api_key  
#   sqs_gemini_results_url   = module.sqs.sqs_gemini_results_url
#   sqs_gemini_results_arn   = module.sqs.sqs_gemini_results_arn
# }

# module "api_gateway" {
#   source = "../../modules/api-gateway"
#   parse_task_lambda_arn       = module.lambda.parse_task_handler.arn
#   generate_schedule_lambda_arn  = module.lambda.vpc_handler.arn
# }