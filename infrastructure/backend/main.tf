module "tf_state_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.0"

  bucket = "tasklazy-terraform-state"
  force_destroy = false

 
  control_object_ownership = true
  object_ownership         = "BucketOwnerEnforced"

  # Versioning configuration
  versioning = {
    enabled    = true
    mfa_delete = false
  }

  # Server-side encryption (SSE-S3)
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  # Recommended security settings
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_dynamodb_table" "tf_locks" {
  name         = "tasklazy-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  # Recommended settings for state locking
  deletion_protection_enabled = true
  tags = {
    Purpose = "Terraform State Locking"
  }
}