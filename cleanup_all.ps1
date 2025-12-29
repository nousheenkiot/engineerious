# cleanup_all.ps1
Write-Host ">>> STARTING NUCLEAR CLEANUP..." -ForegroundColor Red

# Function to clear finalizers if something gets stuck
function Clear-Finalizers($type, $ns = "default") {
    $resources = kubectl get $type -n $ns -o name 2>$null
    foreach ($r in $resources) {
        Write-Host "Clearing finalizers for $r..."
        kubectl patch $r -n $ns -p '{"metadata":{"finalizers":[]}}' --type=merge 2>$null
    }
}

# 1. Kubernetes Cleanup
Write-Host "1. Deleting Webhooks and Ingress Namespace..."
kubectl delete validatingwebhookconfigurations --all --timeout=5s 2>$null
kubectl delete mutatingwebhookconfigurations --all --timeout=5s 2>$null
kubectl delete ns ingress-nginx --grace-period=0 --force --timeout=10s 2>$null

Write-Host "2. Deleting All Resources in Default Namespace..."
# Include every common resource type
$types = "deployments,replicasets,statefulsets,pods,services,configmaps,secrets,pvc,pv,jobs,cronjobs,ingress"
kubectl delete $types --all --grace-period=0 --force --timeout=15s 2>$null

# 3. Handle stuck resources (Finalizers)
Write-Host "3. Patching finalizers for any stuck resources..."
Clear-Finalizers "pods"
Clear-Finalizers "deployments"
Clear-Finalizers "replicasets"
Clear-Finalizers "statefulsets"
Clear-Finalizers "ns" "ingress-nginx"

# 4. Force Stop Docker Containers
Write-Host "4. Forcing Docker container removal..."
$containers = docker ps -a -q
if ($containers) {
    docker rm -f $containers 2>$null
}

# 5. Remove Project Images
Write-Host "5. Removing Project Images..."
$images = @("finance-ui", "cohortservice", "processingservice", "postgres", "kafka", "zookeeper")
foreach ($img in $images) {
    docker rmi -f $img 2>$null
    docker rmi -f "${img}:latest" 2>$null
}

# 6. Final prune
Write-Host "6. Final system prune..."
docker system prune -f 2>$null

Write-Host ">>> CLEANUP COMPLETE. Environment should be dead-clean." -ForegroundColor Green
