# Step 1: Build JAR with Maven (skip tests)
Write-Host "🔨 Building JAR with Maven..."
mvnd clean install "-Dmaven.test.skip=true"

# Step 2: Build Docker image
Write-Host "🐳 Building Docker image..."
docker build -t eurekaserver:latest .

# Step 3: Verify image
docker images eurekaserver

# Step 4: Run locally (Eureka on 8761)
Write-Host "🚀 Running local container on port 8761..."
docker run -d -p 8761:8761 --name eurekaserver_local eurekaserver:latest

# Step 5: Tag for Docker Hub
Write-Host "🏷️ Tagging image for Docker Hub..."
docker tag eurekaserver:latest nousheenkiot/eurekaserver:latest
docker tag eurekaserver:latest nousheenkiot/eurekaserver:1.0

# Step 6: Login & Push
Write-Host "🔑 Logging in to Docker Hub..."
docker login
Write-Host "📤 Pushing images..."
docker push nousheenkiot/eurekaserver:latest
docker push nousheenkiot/eurekaserver:1.0

# Step 7: Run from Docker Hub (port 8080)
Write-Host "🌐 Running image from Docker Hub on port 8080..."
docker run -d -p 8080:8080 --name eurekaserver_remote nousheenkiot/eurekaserver:1.0

Write-Host "✅ Workflow complete!"