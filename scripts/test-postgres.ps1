param([string]$Bin = "C:\Program Files\PostgreSQL\18\bin")
$ErrorActionPreference = "Stop"
$root = Join-Path ([IO.Path]::GetTempPath()) ("apexalith-qa-" + [guid]::NewGuid())
$cluster = Join-Path $root "cluster"
$pwFile = Join-Path $root "bootstrap"
New-Item -ItemType Directory $root | Out-Null
$pw = [guid]::NewGuid().ToString("N")
$env:PGPASSWORD = $pw
$port = Get-Random -Minimum 49000 -Maximum 59000
try {
  [IO.File]::WriteAllText($pwFile, $pw)
  & "$Bin\initdb.exe" -D $cluster --username=qa --auth=scram-sha-256 "--pwfile=$pwFile" --encoding=UTF8 --no-instructions
  if ($LASTEXITCODE) { throw "initdb failed" }
} finally { Remove-Item -LiteralPath $pwFile }
& "$Bin\pg_ctl.exe" -D $cluster -l "$root\postgres.log" -o "-p $port -h 127.0.0.1" -w start
if ($LASTEXITCODE) { throw "Database startup failed" }
try {
  $env:DATABASE_URL = "postgresql://qa:${pw}@127.0.0.1:${port}/postgres"
  node db/migrate.mjs
  if ($LASTEXITCODE) { throw "Migration failed" }
  node db/migrate.mjs
  if ($LASTEXITCODE) { throw "Migration replay failed" }
  $result = & "$Bin\psql.exe" -h 127.0.0.1 -p $port -U qa -d postgres -Atc "SELECT count(*) FROM apexalith.migrations"
  if ($LASTEXITCODE -or [int]$result -lt 1) { throw "Migration ledger check failed" }
  $env:APEXALITH_ISOLATED_QA = "1"
  $env:MEDIA_STORAGE = "local"
  $env:OTP_PROVIDER = "development"
  $env:MEDIA_DIR = Join-Path $root "media"
  if (Test-Path tests/integration.mjs) {
    node --test tests/integration.mjs
    if ($LASTEXITCODE) { throw "Integration tests failed" }
    node --test tests/browser.mjs
    if ($LASTEXITCODE) { throw "Browser tests failed" }
    node scripts/maintenance.mjs
    if ($LASTEXITCODE) { throw "Maintenance failed" }
    & "$Bin\createdb.exe" -h 127.0.0.1 -p $port -U qa seed_qa_dev
    if ($LASTEXITCODE) { throw "QA seed database creation failed" }
    $env:DATABASE_URL = "postgresql://qa:${pw}@127.0.0.1:${port}/seed_qa_dev"
    node db/migrate.mjs
    if ($LASTEXITCODE) { throw "Seed migration failed" }
    $env:NODE_ENV = "production"
    node db/seed.mjs
    if ($LASTEXITCODE -eq 0) { throw "Production seed guard failed" }
    $env:NODE_ENV = "development"
    node db/seed.mjs
    if ($LASTEXITCODE) { throw "Seed failed" }
    node db/seed.mjs
    if ($LASTEXITCODE) { throw "Seed replay failed" }
    $drafts = & "$Bin\psql.exe" -h 127.0.0.1 -p $port -U qa -d seed_qa_dev -Atc "SELECT count(*) FROM apexalith.listings WHERE status='draft'"
    if ($LASTEXITCODE -or [int]$drafts -ne 2) { throw "Seed draft count failed" }
  }
} finally {
  & "$Bin\pg_ctl.exe" -D $cluster -m fast -w stop
  if ($LASTEXITCODE -eq 0) {
    $resolved = (Resolve-Path -LiteralPath $root).Path
    $parent = (Resolve-Path -LiteralPath ([IO.Path]::GetTempPath())).Path.TrimEnd('\')
    if ([IO.Path]::GetDirectoryName($resolved) -eq $parent -and [IO.Path]::GetFileName($resolved) -match '^apexalith-qa-[0-9a-f-]{36}$') {
      Remove-Item -LiteralPath $resolved -Recurse -Force
    }
  }
}
