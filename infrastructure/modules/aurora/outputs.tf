output "db_connection_string" {
  description = "PostgreSQL connection string for the Aurora cluster."
  value       = format(
    "postgres://%s:%s@%s:%s/%s",
    aws_rds_cluster.main.master_username,
    random_password.db_password.result,
    aws_rds_cluster.main.endpoint,
    aws_rds_cluster.main.port,
    aws_rds_cluster.main.database_name
  )
  sensitive   = true
}
