$ErrorActionPreference = 'Stop'

$frontendRoot = $PSScriptRoot
$projectRoot = Split-Path -Parent $frontendRoot
$backendRoot = Join-Path $projectRoot 'backend'
$backendScript = Join-Path $backendRoot 'run-local.ps1'
$backendOutput = Join-Path $backendRoot 'backend-dev.log'
$backendError = Join-Path $backendRoot 'backend-dev-error.log'
$backendPidFile = Join-Path $backendRoot 'backend-dev.pid'

function Test-BackendReady {
    try {
        $response = Invoke-WebRequest -UseBasicParsing 'http://localhost:8080/api/health' -TimeoutSec 2
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Get-SavedBackendProcess {
    if (-not (Test-Path -LiteralPath $backendPidFile)) { return $null }

    $savedPid = Get-Content -LiteralPath $backendPidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $savedPid -or $savedPid -notmatch '^\d+$') { return $null }

    return Get-Process -Id ([int]$savedPid) -ErrorAction SilentlyContinue
}

if (-not (Test-BackendReady)) {
    $backendProcess = Get-SavedBackendProcess
    if ($backendProcess) {
        Write-Host "Backend is already starting (PID $($backendProcess.Id)). Waiting..." -ForegroundColor Yellow
    }
    else {
        Write-Host 'Backend is not running. Starting Spring Boot on port 8080...' -ForegroundColor Yellow
        $backendProcess = Start-Process -FilePath 'powershell.exe' `
            -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $backendScript) `
            -WorkingDirectory $backendRoot `
            -WindowStyle Hidden `
            -RedirectStandardOutput $backendOutput `
            -RedirectStandardError $backendError `
            -PassThru
        Set-Content -LiteralPath $backendPidFile -Value $backendProcess.Id
    }

    $ready = $false
    for ($attempt = 0; $attempt -lt 120; $attempt++) {
        Start-Sleep -Seconds 1
        if (Test-BackendReady) {
            $ready = $true
            break
        }
        if ($backendProcess.HasExited) {
            Write-Host "Backend process exited with code $($backendProcess.ExitCode)." -ForegroundColor Red
            break
        }
    }

    if (-not $ready) {
        Write-Host 'Backend failed to become ready. Latest log output:' -ForegroundColor Red
        if (Test-Path -LiteralPath $backendOutput) { Get-Content -LiteralPath $backendOutput -Tail 30 }
        if (Test-Path -LiteralPath $backendError) { Get-Content -LiteralPath $backendError -Tail 30 }
        Remove-Item -LiteralPath $backendPidFile -Force -ErrorAction SilentlyContinue
        exit 1
    }
}

Write-Host 'Backend is ready: http://localhost:8080' -ForegroundColor Green
$vite = Join-Path $frontendRoot 'node_modules\.bin\vite.cmd'
& $vite '--port=3000' '--host=0.0.0.0' '--open' '/login'
exit $LASTEXITCODE
