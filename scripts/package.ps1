<#
.SYNOPSIS
    Builds a deployable package of Luminia (ASP.NET Core API + Angular SPA in wwwroot).

.DESCRIPTION
    Runs `dotnet publish` on LuminiaAPI in Release mode. The csproj's PublishRunWebpack target
    runs `npm install` + `npm run build` in LuminiaWebsite and copies dist/** into wwwroot/
    (except the map tile sets assets/map and assets/mapDM, which are deployed separately).
    The result is written to artifacts/publish and zipped to artifacts/luminia-<version>.zip,
    where <version> comes from LuminiaWebsite/src/assets/version.json.

.EXAMPLE
    ./scripts/package.ps1
    ./scripts/package.ps1 -NoZip
#>
param(
    [string]$Configuration = "Release",
    [switch]$NoZip
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$artifacts = Join-Path $root "artifacts"
$publishDir = Join-Path $artifacts "publish"

$version = (Get-Content (Join-Path $root "LuminiaAPI/LuminiaWebsite/src/assets/version.json") -Raw | ConvertFrom-Json).version

if (Test-Path $publishDir) { Remove-Item $publishDir -Recurse -Force }

Write-Host "Publishing Luminia $version ($Configuration)..."
dotnet publish (Join-Path $root "LuminiaAPI/LuminiaAPI.csproj") -c $Configuration -o $publishDir --nologo
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed with exit code $LASTEXITCODE" }

if (-not (Test-Path (Join-Path $publishDir "wwwroot/index.html"))) {
    throw "Publish output is missing wwwroot/index.html - the Angular build was not included."
}

if (-not $NoZip) {
    $zip = Join-Path $artifacts "luminia-$version.zip"
    if (Test-Path $zip) { Remove-Item $zip -Force }
    # Build the zip by hand: Compress-Archive in Windows PowerShell 5.1 stores paths with
    # backslashes, which breaks extraction on the host (Plesk). Zip entries need forward slashes.
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $publishRoot = (Resolve-Path $publishDir).Path.TrimEnd('\') + '\'
    $archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        Get-ChildItem $publishDir -Recurse -File | ForEach-Object {
            $entryName = $_.FullName.Substring($publishRoot.Length).Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    }
    finally {
        $archive.Dispose()
    }
    Write-Host "Package: $zip"
}
Write-Host "Publish folder: $publishDir"
