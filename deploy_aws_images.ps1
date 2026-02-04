param (
    [string]$Region = "us-east-1",
    [string]$AccountId
)

if (-not $AccountId) {
    Write-Error "Please provide your AWS Account ID using -AccountId"
    exit 1
}

$RegistryUrl = "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Logging into AWS ECR..."
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $RegistryUrl

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to login to ECR. Please check your credentials."
    exit 1
}

# 1. Build Backend
Write-Host "Building Java Backend..."
Push-Location backend/financeservices
./mvnw clean package -DskipTests
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }
Pop-Location

# 2. Build and Push Services
$Services = @(
    @{ Name = "authservice"; Path = "backend/financeservices/authservice" },
    @{ Name = "cashflowservice"; Path = "backend/financeservices/cashflowservice" },
    @{ Name = "cohortservice"; Path = "backend/financeservices/cohortservice" },
    @{ Name = "processingservice"; Path = "backend/financeservices/processingservice" },
    @{ Name = "finance-ui"; Path = "ui/finance-ui" }
)

foreach ($Service in $Services) {
    $Name = $Service.Name
    $Path = $Service.Path
    $ImageName = "$RegistryUrl/$Name`:latest"
    
    Write-Host "Processing $Name..."
    
    # Check if Repo exists, if not create it
    aws ecr describe-repositories --repository-names $Name --region $Region > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating repository $Name..."
        aws ecr create-repository --repository-name $Name --region $Region
    }

    Write-Host "Building Docker Image for $Name..."
    docker build -t $Name $Path
    
    Write-Host "Tagging $Name..."
    docker tag "$Name`:latest" $ImageName
    
    Write-Host "Pushing $Name to ECR..."
    docker push $ImageName
    
    Write-Host "$Name deployed successfully!"
}

Write-Host "All services pushed to ECR!"
