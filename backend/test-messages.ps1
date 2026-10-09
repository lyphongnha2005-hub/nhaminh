param([string]$BaseUrl = 'http://localhost:8080')
$ErrorActionPreference = 'Stop'
$config = @{}
Get-Content -LiteralPath (Join-Path $PSScriptRoot '.env.local') -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
        $parts = $line.Split('=', 2)
        $config[$parts[0].Trim()] = $parts[1].Trim()
    }
}
if (-not $config['ADMIN_EMAIL'] -or -not $config['ADMIN_PASSWORD']) { throw 'Admin test credentials are not configured.' }
try {
    $loginBody = @{email=$config['ADMIN_EMAIL']; password=$config['ADMIN_PASSWORD']} | ConvertTo-Json
    $session = Invoke-RestMethod "$BaseUrl/api/auth/login" -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 15
} catch { throw 'Unable to authenticate the configured test admin.' }
$headers = @{Authorization="Bearer $($session.accessToken)"}
$createdId = $null
try {
    $body = @{text="Kiểm tra lưu thông điệp $([guid]::NewGuid())"} | ConvertTo-Json
    $created = Invoke-RestMethod "$BaseUrl/api/messages" -Method POST -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 15
    $createdId = $created.id
    if (-not $createdId) { throw 'Create did not return an ID.' }
    $all = Invoke-RestMethod "$BaseUrl/api/admin/messages" -Headers $headers -TimeoutSec 15
    if (-not ($all | Where-Object { $_.id -eq $createdId -and $_.text -eq $created.text })) { throw 'Saved message missing from admin list.' }
    Invoke-RestMethod "$BaseUrl/api/admin/messages/$createdId" -Headers $headers -Method PATCH -ContentType 'application/json' -Body '{"status":"HIDDEN"}' -TimeoutSec 15 | Out-Null
    $public = Invoke-RestMethod "$BaseUrl/api/messages" -TimeoutSec 15
    if ($public | Where-Object { $_.id -eq $createdId }) { throw 'Hidden message leaked to public list.' }
    $all = Invoke-RestMethod "$BaseUrl/api/admin/messages" -Headers $headers -TimeoutSec 15
    if (-not ($all | Where-Object { $_.id -eq $createdId -and $_.status -eq 'HIDDEN' })) { throw 'Hidden state was not persisted.' }
    Invoke-RestMethod "$BaseUrl/api/admin/messages/$createdId" -Headers $headers -Method PATCH -ContentType 'application/json' -Body '{"status":"VISIBLE"}' -TimeoutSec 15 | Out-Null
    $public = Invoke-RestMethod "$BaseUrl/api/messages" -TimeoutSec 15
    if (-not ($public | Where-Object { $_.id -eq $createdId })) { throw 'Restore failed.' }
    Write-Output 'PASS: create, reload, hide, admin visibility, restore.'
} finally {
    if ($createdId) {
        Invoke-RestMethod "$BaseUrl/api/admin/messages/$createdId" -Headers $headers -Method DELETE -TimeoutSec 15 | Out-Null
        $all = Invoke-RestMethod "$BaseUrl/api/admin/messages" -Headers $headers -TimeoutSec 15
        if ($all | Where-Object { $_.id -eq $createdId }) { throw 'Delete was not persisted.' }
        Write-Output 'PASS: delete; temporary test message removed.'
    }
}
