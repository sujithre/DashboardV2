output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  value = azurerm_container_registry.acr.admin_username
}

output "container_app_url" {
  value = azurerm_container_app.app.latest_revision_fqdn
}

output "container_app_name" {
  value = azurerm_container_app.app.name
}
