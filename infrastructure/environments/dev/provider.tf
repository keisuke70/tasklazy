provider "aws" {
  region = "us-west-1"
}

terraform {
  backend "s3" {
    bucket         = "tasklazy-terraform-state" 
    key            = "dev/terraform.tfstate"     
    region         = "us-west-1"                   
    dynamodb_table = "tasklazy-terraform-locks"   
    encrypt        = true
  }
}
