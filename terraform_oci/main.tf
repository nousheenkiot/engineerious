module "networking" {
  source = "./modules/networking"

  compartment_id = var.compartment_id
  project_name   = var.project_name
  environment    = var.environment
  
  # CIDRs are defaulted in module but can be overridden here
  vcn_cidr            = "10.0.0.0/16"
  public_subnet_cidr  = "10.0.1.0/24"
  private_subnet_cidr = "10.0.2.0/24"
}
