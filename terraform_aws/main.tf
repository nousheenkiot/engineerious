terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# 1. VPC Module (Virtual Private Cloud)
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "engineerious-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true # Save money for learning!
}

# 2. EKS Module (Kubernetes Cluster)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "engineerious-cluster"
  cluster_version = "1.27"

  cluster_endpoint_public_access  = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.public_subnets

  eks_managed_node_groups = {
    green = {
      min_size     = 1
      max_size     = 2
      desired_size = 2

      instance_types = ["t3.medium"]
      capacity_type  = "SPOT" # Save money!
    }
  }
}

# 3. ECR Repositories (Docker Image Storage)
resource "aws_ecr_repository" "repos" {
  for_each = toset(["authservice", "cashflowservice", "cohortservice", "processingservice", "finance-ui"])
  name     = each.key
  force_delete = true
}
