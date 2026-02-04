# AWS Deployment Guide for Engineerious (Helm + Terraform Edition)

This guide takes your deployment to the next level using **Terraform** (Infrastructure as Code) and **Helm** (Kubernetes Package Manager).

## Prerequisites

1.  **Terraform**: [Install Terraform](https://developer.hashicorp.com/terraform/install)
2.  **Helm**: [Install Helm](https://helm.sh/docs/intro/install/)
3.  **AWS CLI**: (Already installed from previous step)

## Part 1: Provision Infrastructure (Terraform)

Instead of using `eksctl` manually, we will let Terraform build our specific infrastructure.

1.  Navigate to the AWS Terraform directory:
    ```powershell
    cd terraform_aws
    ```

2.  Initialize Terraform (downloads plugins):
    ```powershell
    terraform init
    ```

3.  Preview the changes:
    ```powershell
    terraform plan
    ```

4.  Apply the changes (Type `yes` when asked):
    ```powershell
    terraform apply
    ```
    *This will take 15-20 minutes. It creates the VPC, EKS Cluster, and ECR Repositories.*

5.  **Connect `kubectl` to your new cluster:**
    Terraform will output a command, or you can run:
    ```powershell
    aws eks update-kubeconfig --region us-east-1 --name engineerious-cluster
    ```

## Part 2: Build & Push Images

Use the same script as before, but now you can get the Account ID from Terraform outputs or AWS Console.

```powershell
cd ..
.\deploy_aws_images.ps1 -Region "us-east-1" -AccountId "YOUR_ACCOUNT_ID"
```

## Part 3: Deploy Application (Helm)

Instead of applying many YAML files, we install the "Chart".

1.  Open `helm/engineerious/values.yaml` and update:
    *   `images.registry`: Your new ECR URL (e.g., `12345.dkr.ecr.us-east-1.amazonaws.com`).
    *   `postgres.password`: Set a secure password.

2.  Install the chart:
    ```powershell
    helm install engineerious ./helm/engineerious
    ```

3.  **Upgrade** (if you make changes):
    ```powershell
    helm upgrade engineerious ./helm/engineerious
    ```

## Cleaning Up

To delete everything and stop paying AWS:

1.  Uninstall App:
    ```powershell
    helm uninstall engineerious
    ```
2.  Destroy Infrastructure:
    ```powershell
    cd terraform_aws
    terraform destroy
    ```
