# wait_and_test.ps1

function Test-PolicyEndpoint {
    $baseUrl = "http://localhost:8080/api/policies"
    
    # 1. Wait for service to be ready
    Write-Host "Waiting for Cohort Service to be ready..."
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl" -Method Get -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "Service is ready!"
                break
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }

    # 2. Create a Policy
    Write-Host "`nCreating a new policy..."
    $body = @{
        policyNumber = "POL-123"
        holderName   = "John Doe"
        premium      = 1000.0
    } | ConvertTo-Json

    try {
        $createResponse = Invoke-RestMethod -Uri "$baseUrl" -Method Post -Body $body -ContentType "application/json"
        Write-Host "Policy Created: $($createResponse | ConvertTo-Json -Depth 2)"
        $policyId = $createResponse.id
    }
    catch {
        Write-Error "Failed to create policy: $_"
        return
    }

    # 3. Update the Policy (PUT)
    Write-Host "`nUpdating policy ID $policyId..."
    $updateBody = @{
        policyNumber = "POL-123-UPDATED"
        holderName   = "John Doe Updated"
        premium      = 1200.0
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/$policyId" -Method Put -Body $updateBody -ContentType "application/json"
        Write-Host "Policy Updated Response: $($updateResponse | ConvertTo-Json -Depth 2)"
    }
    catch {
        Write-Error "Failed to update policy: $_"
        return
    }

    # 4. Verify Update (Get by ID)
    Write-Host "`nVerifying update..."
    try {
        $getResponse = Invoke-RestMethod -Uri "$baseUrl/$policyId" -Method Get
        Write-Host "Retrieved Policy: $($getResponse | ConvertTo-Json -Depth 2)"

        if ($getResponse.holderName -eq "John Doe Updated" -and $getResponse.premium -eq 1200.0) {
            Write-Host "`nSUCCESS: Policy update verified!" -ForegroundColor Green
        }
        else {
            Write-Host "`nFAILURE: Policy update verification failed." -ForegroundColor Red
        }
    }
    catch {
        Write-Error "Failed to retrieve policy: $_"
    }
}

Test-PolicyEndpoint
