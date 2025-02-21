# aurora/main.tf

resource "random_password" "db_password" {
  length  = 16
  special = false
}

resource "aws_db_subnet_group" "main" {
  name       = "myapp-db-subnet-group"
  subnet_ids = var.private_subnet_ids
}

# Aurora cluster definition
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "myapp-db-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "15.3"
  database_name           = "mydb"
  master_username         = "dbadmin"
  master_password         = random_password.db_password.result
  skip_final_snapshot     = true
  vpc_security_group_ids  = [var.db_security_group_id]
  db_subnet_group_name    = aws_db_subnet_group.main.name
}

resource "aws_rds_cluster_instance" "main" {
  identifier              = "myapp-db-instance-1"
  cluster_identifier      = aws_rds_cluster.main.id
  engine                  = aws_rds_cluster.main.engine
  instance_class          = "db.r6g.large"
  db_subnet_group_name    = aws_db_subnet_group.main.name
  publicly_accessible     = false
}
