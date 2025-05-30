variable "location" {
  type        = string
  description = "Azure region where resources will be created"
  default     = "westeurope"
}

variable "environment" {
  type        = string
  description = "Environment name for the resources"
  default     = "dev"
}

variable "project" {
  type        = string
  description = "Project name"
  default     = "ex5travel"
}

variable "acr_sku" {
  type        = string
  description = "SKU for Azure Container Registry"
  default     = "Basic"
}

variable "container_app_environment_infrastructure_subnet_id" {
  type        = string
  description = "Subnet ID for Container App Environment infrastructure"
  default     = null
}

variable "container_app_cpu" {
  type        = number
  description = "CPU cores for Container App"
  default     = 0.5
}

variable "container_app_memory" {
  type        = string
  description = "Memory for Container App"
  default     = "1Gi"
}

variable "container_app_min_replicas" {
  type        = number
  description = "Minimum number of replicas"
  default     = 1
}

variable "container_app_max_replicas" {
  type        = number
  description = "Maximum number of replicas"
  default     = 3
}
