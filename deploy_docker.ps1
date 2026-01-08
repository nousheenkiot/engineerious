# deploy_docker.ps1
# Usage: ./deploy_docker.ps1

Write-Host "================================="
Write-Host "Starting Local Docker Deployment"
Write-Host "================================="

# 1. Configuration
$PROJECT_ROOT = $PSScriptRoot
$BACKEND_DIR = "$PROJECT_ROOT/backend/financeservices"
$UI_DIR = "$PROJECT_ROOT/ui/finance-ui"

# Switch to project root
Set-Location $PROJECT_ROOT

# 2. Build Backend Services (JARs)
Write-Host "`n>>> Building Backend Services (JARs)..."
Push-Location $BACKEND_DIR

# Ensure mvnw is executable (for Unix-like environments if running via WSL, but here we are on Windows)
# On Windows, we just call it.
./mvnw clean package -DskipTests

if ($LASTEXITCODE -ne 0) { 
    Write-Error "Maven build failed!"
    Pop-Location
    exit 1 
}
Pop-Location

# 3. Build and Start Docker Compose
Write-Host "`n>>> Starting Docker Compose (Build & Deploy)..."
Write-Host "This will build images and start the Gateway, UI, and Backend Services."

docker-compose down
docker-compose up --build -d

if ($LASTEXITCODE -ne 0) { 
    Write-Error "Docker Compose failed to start!"
    exit 1 
}

Write-Host "`n================================="
Write-Host "Deployment Successful!"
Write-Host "---------------------------------"
Write-Host "Gateway/UI:  http://localhost"
Write-Host "API Docs:    http://localhost/finance/docs"
Write-Host "Kafka UI:    http://localhost:8090"
Write-Host "---------------------------------"
Write-Host "Use 'docker-compose logs -f' to view logs."
Write-Host "================================="
