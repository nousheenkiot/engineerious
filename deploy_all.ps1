# deploy_all.ps1
# Usage: ./deploy_all.ps1 [env]
# env: dev, prod, local (default: local)

param (
    [string]$env = "local"
)

Write-Host "==========================="
Write-Host "Starting Deployment for: $env"
Write-Host "==========================="

# 1. Environment Configuration
$BACKEND_DIR = "backend/financeservices"
$UI_DIR = "ui/finance-ui"

# Switch to project root
Set-Location $PSScriptRoot

# 2. Build Backend Services
Write-Host "`n>>> Building Backend Services..."
Push-Location $BACKEND_DIR

# Build JARs
./mvnw clean package -DskipTests

if ($LASTEXITCODE -ne 0) { Write-Error "Maven build failed"; exit 1 }

# Build Docker Images
$services = @("configserver", "eurekaserver", "cohortservice", "processingservice", "apigateway")

foreach ($service in $services) {
    Write-Host "Building Docker image for $service..."
    docker build -t "${service}:latest" ./$service
}

Pop-Location

# 3. Build Frontend Service
Write-Host "`n>>> Building Frontend Service..."
Push-Location $UI_DIR

Write-Host "Building Docker image for finance-ui..."
docker build -t "finance-ui:latest" .

Pop-Location

# 4. Deploy to Kubernetes
Write-Host "`n>>> Deploying to Kubernetes ($env)..."

# Apply based on environment
if ($env -eq "prod") {
    # Assuming you have a specific overlay for prod
    kubectl apply -k "$BACKEND_DIR/k8s/overlays/prod"
}
elseif ($env -eq "dev") {
    # Assuming you have a specific overlay for dev
    kubectl apply -k "$BACKEND_DIR/k8s/overlays/dev"
}
else {
    # Default to base/local
    Write-Host "Applying Base Kustomization..."
    kubectl apply -k "$BACKEND_DIR/k8s/base"
}

# Apply UI Deployment (assuming common deployment for now, or you can add Kustomize for UI too)
Write-Host "Deploying UI..."
kubectl apply -f "$UI_DIR/k8s/deployment.yml"

Write-Host "`n==========================="
Write-Host "Deployment Triggered Successfully!"
Write-Host "Monitor status with: kubectl get pods"
Write-Host "==========================="
