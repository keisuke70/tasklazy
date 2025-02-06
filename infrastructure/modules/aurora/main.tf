# aurora/main.tf
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "myapp-db-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "15.3"
  database_name           = "mydb"
  master_username         = "admin"
  master_password         = random_password.db_password.result
  skip_final_snapshot     = true
  vpc_security_group_ids  = [var.db_security_group_id]
  db_subnet_group_name    = aws_db_subnet_group.main.name
}

resource "random_password" "db_password" {
  length  = 16
  special = false
}

resource "aws_db_subnet_group" "main" {
  name       = "myapp-db-subnet-group"
  subnet_ids = var.private_subnet_ids
}