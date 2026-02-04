variable "tenancy_ocid" {
  description = "OCI Tenancy OCID"
  type        = string
}

variable "user_ocid" {
  description = "OCI User OCID"
  type        = string
}

variable "fingerprint" {
  description = "OCI User Fingerprint"
  type        = string
}

variable "private_key_path" {
  description = "Path to OCI Private Key"
  type        = string
}

variable "region" {
  description = "OCI Region"
  type        = string
  default     = "us-ashburn-1"
}

variable "compartment_id" {
  description = "OCI Compartment OCID"
  type        = string
}

variable "project_name" {
  description = "Project Name for Tagging"
  type        = string
  default     = "Engineerious"
}

variable "environment" {
  description = "Environment Name"
  type        = string
  default     = "Dev"
}
