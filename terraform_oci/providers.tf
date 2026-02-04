terraform {
  required_version = ">= 1.0.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 4.0.0"
    }
  }

  # Industry Standard: Use a remote backend (S3, OCI Storage, Terraform Cloud)
  # For local development we use local state, but we provide the block structure.
  /*
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "engineerious/terraform.tfstate"
    region = "us-ashburn-1"
  }
  */
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}
