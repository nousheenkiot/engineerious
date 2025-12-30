Write-Host ">>> Starting Local Tunnels for Development..." -ForegroundColor Cyan

# Check if ports are already in use
$ports = @(5432, 29092)
foreach ($port in $ports) {
    if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
        Write-Host "Warning: Port $port is generally in use. Stopping existing tunnels might be required." -ForegroundColor Yellow
    }
}

# Start Postgres Tunnel
Write-Host "Forwarding Postgres (5432 -> 5432)..."
Start-Process -FilePath "kubectl" -ArgumentList "port-forward svc/postgres 5432:5432" -PassThru -NoNewWindow | Out-Null

# Start Kafka Tunnel
Write-Host "Forwarding Kafka (29092 -> 29092)..."
Start-Process -FilePath "kubectl" -ArgumentList "port-forward svc/kafka 29092:29092" -PassThru -NoNewWindow | Out-Null

Write-Host ">>> Tunnels Active." -ForegroundColor Green
Write-Host "   Postgres: jdbc:postgresql://localhost:5432/mydb"
Write-Host "   Kafka:    localhost:29092"
Write-Host "Press Ctrl+C to stop (if running in foreground) or close terminal to kill tunnels."
