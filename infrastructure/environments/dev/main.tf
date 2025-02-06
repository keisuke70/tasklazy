# environments/dev/main.tf
module "networking" {
  source = "../../modules/networking"
}

module "aurora" {
  source              = "../../modules/aurora"
  vpc_id              = module.networking.vpc_id
  private_subnet_ids  = module.networking.private_subnet_ids
  db_security_group_id = module.networking.db_security_group_id
}

module "lambda" {
  source                = "../../modules/lambda"
  subnet_ids            = module.networking.private_subnet_ids
  lambda_security_group_id = module.networking.lambda_security_group_id
  db_secret_arn         = module.aurora.db_secret_arn
}

module "api_gateway" {
  source     = "../../modules/api-gateway"
  lambda_arn = module.lambda.create_user_arn
}