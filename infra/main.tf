locals {
  resource_name_prefix = "${var.project}-${var.environment}"
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.resource_name_prefix}-rg"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "azurerm_container_registry" "acr" {
  name                = replace("${local.resource_name_prefix}acr", "-", "")
  resource_group_name = azurerm_resource_group.rg.name
  location           = azurerm_resource_group.rg.location
  sku                = var.acr_sku
  admin_enabled      = true

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "azurerm_log_analytics_workspace" "law" {
  name                = "${local.resource_name_prefix}-law"
  resource_group_name = azurerm_resource_group.rg.name
  location           = azurerm_resource_group.rg.location
  sku                = "PerGB2018"
  retention_in_days  = 30

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "azurerm_container_app_environment" "env" {
  name                       = "${local.resource_name_prefix}-env"
  resource_group_name       = azurerm_resource_group.rg.name
  location                  = azurerm_resource_group.rg.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id

  infrastructure_subnet_id = var.container_app_environment_infrastructure_subnet_id

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "azurerm_container_app" "app" {
  name                         = "${local.resource_name_prefix}-app"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name         = azurerm_resource_group.rg.name
  revision_mode               = "Single"

  template {
    container {
      name   = "app"
      image  = "${azurerm_container_registry.acr.login_server}/${var.project}:latest"
      cpu    = var.container_app_cpu
      memory = var.container_app_memory
    }
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username            = azurerm_container_registry.acr.admin_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }

  ingress {
    external_enabled = true
    target_port     = 5000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  scale {
    min_replicas = var.container_app_min_replicas
    max_replicas = var.container_app_max_replicas

    rules = [
      {
        name = "http-rule"
        http = {
          metadata = {
            concurrency = "100"
          }
        }
      }
    ]
  }

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}
