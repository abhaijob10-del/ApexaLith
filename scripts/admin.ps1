param([Parameter(Mandatory)][ValidateSet("create","reset","enable-mfa","disable-mfa")][string]$Operation,[Parameter(Mandatory)][string]$Email)
if ($Operation -eq "disable-mfa") { "" | node scripts/admin.mjs $Operation $Email; exit $LASTEXITCODE }
$prompt = if ($Operation -eq "enable-mfa") { "Authenticator Base32 secret (32 to 64 characters)" } else { "Administrator password (14 to 128 characters)" }
$password = Read-Host $prompt -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
try {
  $OutputEncoding = New-Object System.Text.UTF8Encoding($false)
  [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) | node scripts/admin.mjs $Operation $Email
  exit $LASTEXITCODE
} finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
