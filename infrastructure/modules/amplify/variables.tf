variable "app_name" {
  description = "Name of the Amplify app"
  type        = string
}

variable "repository" {
  description = "The repository URL for the Amplify app"
  type        = string
}

variable "build_spec" {
  description = "The build specification YAML content for Amplify (as a string)"
  type        = string
}

variable "environment_variables" {
  description = "Map of environment variables for the Amplify app"
  type        = map(string)
  default     = {}
}

variable "description" {
  description = "Description for the Amplify app"
  type        = string
  default     = ""
}

variable "custom_rules" {
  description = "Optional list of custom rewrite/redirect rules"
  type = list(object({
    source = string
    target = string
    status = string
  }))
  default = []
}
