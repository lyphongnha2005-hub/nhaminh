$ErrorActionPreference = 'Stop'

$envFile = Join-Path $PSScriptRoot '.env.local'
if (-not (Test-Path -LiteralPath $envFile)) {
    throw "Không tìm thấy $envFile. Hãy tạo file từ cấu hình local của dự án."
}

Get-Content -LiteralPath $envFile -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) { return }

    $separator = $line.IndexOf('=')
    if ($separator -lt 1) { throw "Dòng cấu hình không hợp lệ: $line" }

    $name = $line.Substring(0, $separator).Trim()
    $value = $line.Substring($separator + 1).Trim()
    [Environment]::SetEnvironmentVariable($name, $value, 'Process')
}

try {
    $health = Invoke-WebRequest -UseBasicParsing 'http://localhost:8080/api/health' -TimeoutSec 2
    if ($health.StatusCode -eq 200) {
        Write-Host 'Backend is already running at http://localhost:8080. Do not start another mvn process.' -ForegroundColor Green
        exit 0
    }
}
catch {
    $portInUse = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if (-not $portInUse) {
        $portInUse = netstat -ano -p tcp | Select-String ':8080\s+.*LISTENING'
    }
    if ($portInUse) {
        $listener = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
        $owner = if ($listener) { " PID $($listener.OwningProcess)" } else { '' }
        throw "Port 8080 is already in use$owner. If this is Nhà Mình, keep it running and do not start mvn again; otherwise stop the process before starting this backend."
    }
}

Push-Location $PSScriptRoot
try {
    & mvn spring-boot:run
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
