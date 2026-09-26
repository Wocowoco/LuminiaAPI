# Renders numbered contact sheets of an icon pack, to pick icons for the research tree.
#
#   ./scripts/research-tree/icon-sheet.ps1 -Pack skilliconpack
#
# Writes <pack>_<n>.png sheets (120 icons each) and <pack>.txt (number -> file path)
# to %TEMP%\research-icon-sheets, and prints their paths.
param(
  [Parameter(Mandatory)] [string]$Pack,
  [string]$IconRoot = 'D:\DnD\Icons',
  [int]$PerSheet = 120
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$out = Join-Path $env:TEMP 'research-icon-sheets'
New-Item -ItemType Directory -Force $out | Out-Null
# Skip the packs' duplicate "with background" folders and add-on overlays
$files = Get-ChildItem -Recurse -File (Join-Path $IconRoot $Pack) |
  Where-Object { $_.Extension -match '^\.png$' -and $_.FullName -notmatch '\\(bg|back|black|addons?|[^\\]*_b|[^\\]*_bg)\\' } |
  Sort-Object FullName
if (-not $files) { throw "No PNG icons found in $(Join-Path $IconRoot $Pack)" }

$name = $Pack -replace '[\\/]', '_'
$index = Join-Path $out "$name.txt"
$i = 0
$files | ForEach-Object { "{0}`t{1}" -f $i++, $_.FullName } | Set-Content -Encoding utf8 $index

$cell = 72; $cols = 12
$font = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Bold)
for ($s = 0; $s * $PerSheet -lt $files.Count; $s++) {
  $chunk = $files | Select-Object -Skip ($s * $PerSheet) -First $PerSheet
  $rows = [math]::Ceiling($chunk.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap ($cols * $cell), ($rows * $cell)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(44, 43, 37))
  $g.InterpolationMode = 'HighQualityBicubic'
  $k = 0
  foreach ($f in $chunk) {
    $x = ($k % $cols) * $cell; $y = [math]::Floor($k / $cols) * $cell
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $g.DrawImage($img, $x + 2, $y + 2, $cell - 4, $cell - 4)
    $img.Dispose()
    $g.FillRectangle([System.Drawing.Brushes]::Black, $x, $y, 26, 14)
    $g.DrawString("$($s * $PerSheet + $k)", $font, [System.Drawing.Brushes]::Yellow, $x + 1, $y)
    $k++
  }
  $sheet = Join-Path $out ("{0}_{1}.png" -f $name, $s)
  $bmp.Save($sheet, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  $sheet
}
$index
