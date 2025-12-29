# cleanup_all.ps1
Write-Host ">>> STARTING AGGRESSIVE CLEANUP..." -ForegroundColor Red

# 1. Clean Kubernetes Resources (More thorough)
Write-Host "1. Deleting all Kubernetes resources in all namespaces (except kube-system)..."
# We first try to delete the Ingress specific components which often hang
kubectl delete validatingwebhookconfigurations --all 2>$null
kubectl delete mutatingwebhookconfigurations --all 2>$null
kubectl delete jobs --all -n ingress-nginx --grace-period=0 --force 2>$null
kubectl delete deployments --all -n ingress-nginx --grace-period=0 --force 2>$null
kubectl delete ns ingress-nginx --grace-period=0 --force 2>$null

# 2. General Resource Cleanup
Write-Host "2. Deleting Deployments, Services, Pods, ConfigMaps in Default Namespace..."
kubectl delete daemonsets, replicasets, services, deployments, pods, rc, ingress, configmaps, secrets, pvc, pv --all --grace-period=0 --force 2>$null

# 3. Stop & Remove All Docker Containers (Regardless of if they are K8s managed)
Write-Host "3. Forcing Docker container removal..."
$containers = docker ps -a -q
if ($containers) {
    docker stop $containers 2>$null
    docker rm -f $containers 2>$null
}

# 4. Remove Project Images
Write-Host "4. Removing Project Images..."
$images = @("finance-ui", "cohortservice", "processingservice", "postgres", "kafka", "zookeeper")
foreach ($img in $images) {
    Write-Host "Removing image: $img"
    docker rmi -f $img 2>$null
    docker rmi -f "${img}:latest" 2>$null
}

# 5. Prune Docker
Write-Host "5. Final prune..."
docker system prune -f 2>$null

Write-Host ">>> CLEANUP COMPLETE. Environment is clean." -ForegroundColor Green
