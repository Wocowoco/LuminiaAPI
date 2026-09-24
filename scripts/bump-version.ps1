<#
.SYNOPSIS
    Bumps the Luminia version in LuminiaWebsite/src/assets/version.json.

.DESCRIPTION
    Reads the current semantic version, increments the requested part and writes it back.
    major: 2.1.0 -> 3.0.0, minor: 2.1.0 -> 2.2.0, patch: 2.1.0 -> 2.1.1.
    Refuses to run if the new version's git tag (v<version>) already exists.
    Prints the new version as the last line of output. Does not commit or tag.

.EXAMPLE
    ./scripts/bump-version.ps1 -Level minor
    ./scripts/bump-version.ps1 -Level patch -DryRun
#>
param(
    [Parameter(Mandatory)]
    [ValidateSet("major", "minor", "patch")]
    [string]$Level,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$versionFile = Join-Path $root "LuminiaAPI/LuminiaWebsite/src/assets/version.json"

$content = Get-Content $versionFile -Raw
$match = [regex]::Match($content, '"version"\s*:\s*"(\d+)\.(\d+)\.(\d+)"')
if (-not $match.Success) { throw "Could not find a semantic version in $versionFile" }

$major = [int]$match.Groups[1].Value
$minor = [int]$match.Groups[2].Value
$patch = [int]$match.Groups[3].Value
$current = "$major.$minor.$patch"

switch ($Level) {
    "major" { $major++; $minor = 0; $patch = 0 }
    "minor" { $minor++; $patch = 0 }
    "patch" { $patch++ }
}
$new = "$major.$minor.$patch"

git -C $root rev-parse -q --verify "refs/tags/v$new" *> $null
if ($LASTEXITCODE -eq 0) { throw "Tag v$new already exists." }

Write-Host "Bumping version: $current -> $new ($Level)"
if (-not $DryRun) {
    $updated = $content.Remove($match.Index, $match.Length).Insert($match.Index, "`"version`": `"$new`"")
    [System.IO.File]::WriteAllText($versionFile, $updated)
}
Write-Output $new
