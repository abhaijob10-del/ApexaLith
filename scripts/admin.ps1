param([Parameter(Mandatory)][ValidateSet("create","reset")][string]$Operation,[Parameter(Mandatory)][string]$Email)
$password = Read-Host "Administrator password (14 to 128 characters)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
try {
  $OutputEncoding = New-Object System.Text.UTF8Encoding($false)
  [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) | node scripts/admin.mjs $Operation $Email
  exit $LASTEXITCODE
} finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
