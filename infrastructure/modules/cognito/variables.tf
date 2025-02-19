variable "user_pool_name" {
  description = "Name of the Cognito User Pool"
  type        = string
}

variable "auto_verified_attributes" {
  description = "Attributes to auto-verify (e.g., email)"
  type        = list(string)
  default     = ["email"]
}

variable "mfa_configuration" {
  description = "MFA configuration for the user pool (OFF, ON, OPTIONAL)"
  type        = string
  default     = "OFF"
}

variable "password_minimum_length" {
  description = "Minimum password length for the user pool"
  type        = number
  default     = 8
}

variable "password_require_uppercase" {
  description = "Whether passwords require uppercase letters"
  type        = bool
  default     = true
}

variable "password_require_lowercase" {
  description = "Whether passwords require lowercase letters"
  type        = bool
  default     = true
}

variable "password_require_numbers" {
  description = "Whether passwords require numbers"
  type        = bool
  default     = true
}

variable "password_require_symbols" {
  description = "Whether passwords require symbols"
  type        = bool
  default     = false
}

variable "user_pool_client_name" {
  description = "Name of the Cognito User Pool Client"
  type        = string
}

variable "explicit_auth_flows" {
  description = "List of allowed explicit auth flows"
  type        = list(string)
  default     = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}

variable "generate_secret" {
  description = "Indicates whether to generate a secret for the client"
  type        = bool
  default     = false
}

variable "refresh_token_validity" {
  description = "Refresh token validity period (in days)"
  type        = number
  default     = 30
}
