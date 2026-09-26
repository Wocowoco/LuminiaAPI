# Adds an icon to the research tree: scales it to 96x96 and saves it in
# LuminiaWebsite/src/assets/images/infernal-alchemy/research/. Icons with transparency
# (potions) are saved as PNG, opaque square icons (skills) as JPEG to keep them small.
#
#   ./scripts/research-tree/icon.ps1 -Name frost-nova -Source 'D:\DnD\Icons\skilliconpack\...\icon.png'
#
# Prints the file name to use as `icon` in research-tree.data.ts.
param(
  [Parameter(Mandatory)] [ValidatePattern('^[a-z0-9-]+$')] [string]$Name,
  [Parameter(Mandatory)] [string]$Source,
  [ValidateSet('auto', 'png', 'jpg')] [string]$Format = 'auto',
  [int]$Size = 96,
  [switch]$Force
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$dest = Join-Path $PSScriptRoot '..\..\LuminiaAPI\LuminiaWebsite\src\assets\images\infernal-alchemy\research'
$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Source))
try {
  if ($Format -eq 'auto') {
    # Transparent if any pixel along the border (or the centre row) isn't fully opaque
    $transparent = $false
    $w = $src.Width; $h = $src.Height
    foreach ($t in 0..31) {
      $x = [int]($t * ($w - 1) / 31); $y = [int]($t * ($h - 1) / 31)
      foreach ($p in @(@($x, 0), @($x, ($h - 1)), @(0, $y), @(($w - 1), $y), @($x, [int]($h / 2)))) {
        if ($src.GetPixel($p[0], $p[1]).A -lt 250) { $transparent = $true; break }
      }
      if ($transparent) { break }
    }
    $Format = if ($transparent) { 'png' } else { 'jpg' }
  }

  $file = Join-Path $dest "$Name.$Format"
  $other = Join-Path $dest ("$Name." + $(if ($Format -eq 'png') { 'jpg' } else { 'png' }))
  if (((Test-Path $file) -or (Test-Path $other)) -and -not $Force) { throw "An icon named '$Name' already exists in $dest (use -Force to replace it)" }

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($src, 0, 0, $Size, $Size)
  if ($Format -eq 'jpg') {
    $jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $quality = New-Object System.Drawing.Imaging.EncoderParameters 1
    $quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 82L
    $bmp.Save($file, $jpeg, $quality)
  } else {
    $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  $g.Dispose(); $bmp.Dispose()
} finally {
  $src.Dispose()
}
"{0} ({1:N1} KB)" -f (Split-Path $file -Leaf), ((Get-Item $file).Length / 1KB)
