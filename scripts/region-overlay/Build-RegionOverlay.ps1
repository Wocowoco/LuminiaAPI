<#
.SYNOPSIS
    Rebuilds the world map's region shapes (LuminiaWebsite/src/assets/regions.json) from the DM's region map.

.DESCRIPTION
    The region map (worldmap_regions.jpg, 18072 x 13753 px) draws each region's border as a solid line in
    the region's own colour, just inside the region. Segment.cs finds those lines, splits the land between
    them and gives each piece to the region whose border it touches most (plus a few anchor points for
    pieces where terrain colours get in the way), fills gaps enclosed by a region, then traces each
    region's outline into vector rings (in region-map pixels) for the map to draw.

    If you change a border colour or add a region, update Names/Border/Tol in Segment.cs and the anchors
    below. Region labels and the alignment with the tiles live in
    src/app/map/maplayers/regions-overlay.layer.ts.

    Takes about a minute. Writes regions-preview.png next to this script so you can check the result.
#>
param(
    [string]$RegionMap = "D:\DnD\Luminia\worldmap_regions.jpg"
)

$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$out = Join-Path $here "..\..\LuminiaAPI\LuminiaWebsite\src\assets\regions.json"

Add-Type -Path (Join-Path $here 'Segment.cs') -ReferencedAssemblies System.Drawing
[Segment]::Load($RegionMap, 0.25)
[Segment]::Tol[0] = 20   # Aritunn's brown is close to Sinawiran's terrain; keep it strict

# Anchors: {region index, x, y} in full-size region-map pixels. The land piece holding an anchor always
# goes to that region. Indexes follow [Segment]::Names.
[Segment]::Seeds = [int[][]]@(
    ,[int[]]@(0, 4852, 3976)    # Aritunn
    ,[int[]]@(0, 6443, 3903)    # Aritunn: islet next to North Paikka
    ,[int[]]@(0, 11476, 2169)   # Aritunn: north-east island
    ,[int[]]@(1, 9036, 4247)    # Chorne Derev
    ,[int[]]@(2, 5783, 5512)    # North Paikka
    ,[int[]]@(3, 3931, 6687)    # Tikushi
    ,[int[]]@(4, 3614, 8855)    # Myrill
    ,[int[]]@(5, 7337, 7138)    # South Paikka
    ,[int[]]@(6, 9352, 6235)    # Alodia
    ,[int[]]@(7, 11593, 5331)   # Rilsonia
    ,[int[]]@(8, 9551, 7861)    # Sinawiran (east)
    ,[int[]]@(8, 6524, 9036)    # Sinawiran (west)
    ,[int[]]@(9, 11114, 8675)   # Kewara
)

[Segment]::Run(1500, 300, 40, 40)

# The big lake where Tikushi, Myrill and both Paikkas meet belongs to no region (the map shows it split
# between them by mistake). Seeds: one or more points in each tinted part of the water, in region-map pixels.
[Segment]::CarveLake([int[][]]@(
    ,[int[]]@(4700, 6920)   # Tikushi part
    ,[int[]]@(4500, 7000)   # Tikushi part, west arm
    ,[int[]]@(5700, 6000)   # North Paikka part (grey)
    ,[int[]]@(5060, 6800)   # North Paikka part, south
    ,[int[]]@(5700, 7400)   # South Paikka part (light blue triangle)
    ,[int[]]@(5100, 7640)   # Myrill part
    ,[int[]]@(5340, 8040)   # Myrill part, south arm
), [int[]]@(4100, 5700, 6400, 8400), 10, 45, 8)

# Hand corrections, as polygons in region-map pixels: Myrill land inside goes to Tikushi.
# Tikushi/Myrill border by the lake: it follows the line (4542,7513) -> (4687,7635) to the shore; the strip of
# Myrill's border line left along Tikushi's lake shore is Tikushi too.
[Segment]::Reassign([int[][]]@(
    ,[int[]]@(4542, 7513)   # the new border line...
    ,[int[]]@(4601, 7542)
    ,[int[]]@(4651, 7576)
    ,[int[]]@(4675, 7607)
    ,[int[]]@(4687, 7635)   # ...reaching the lake shore
    ,[int[]]@(4705, 7590)   # then out over the lake, around the strip along the shore
    ,[int[]]@(5000, 7480)
    ,[int[]]@(5000, 7380)
    ,[int[]]@(4542, 7380)
), 4, 3)

# Kewara/Rilsonia border on the eastern island: from the west coast to the east corner and down to the south
# coast. Kewara north/east of that line (the strip of its border line running up the coast) is Rilsonia,
# and Rilsonia south/west of it is Kewara.
$kewaraRilsoniaLine = @(
    ,[int[]]@(14855, 4431)   # west coast
    ,[int[]]@(14953, 4509)
    ,[int[]]@(15078, 4606)
    ,[int[]]@(15226, 4751)
    ,[int[]]@(15382, 4880)
    ,[int[]]@(15491, 4977)   # east corner
    ,[int[]]@(15401, 5063)
    ,[int[]]@(15296, 5152)
    ,[int[]]@(15218, 5250)
    ,[int[]]@(15148, 5386)
    ,[int[]]@(15089, 5523)   # south coast
)
[Segment]::Reassign([int[][]]($kewaraRilsoniaLine[0..5] + @(,[int[]]@(16000, 4977)) + @(,[int[]]@(16000, 3800)) + @(,[int[]]@(14855, 3800))), 9, 7)
[Segment]::Reassign([int[][]]($kewaraRilsoniaLine + @(,[int[]]@(14300, 5523)) + @(,[int[]]@(14300, 4431))), 7, 9)

# The strait between Rilsonia's mainland and its eastern island: the "Rilsonia" label on the map is written
# across it, and its letters were read as land, joining the two. Clear the water between the two coastlines.
[Segment]::Reassign([int[][]]@(
    ,[int[]]@(11540, 4835)
    ,[int[]]@(11720, 4835)
    ,[int[]]@(11660, 4880)
    ,[int[]]@(11640, 4905)
    ,[int[]]@(11650, 4950)
    ,[int[]]@(11655, 5010)
    ,[int[]]@(11628, 5010)
    ,[int[]]@(11610, 4950)
    ,[int[]]@(11590, 4905)
    ,[int[]]@(11560, 4870)
), -1, -1)

[Segment]::SavePreview((Join-Path $here 'regions-preview.png'), 1400)
# Outlines simplified to within 1 working pixel (~4 region-map pixels, ~200 m); rocks under 20 px dropped.
$stats = [Segment]::SaveVectors((Resolve-Path (Split-Path $out)).Path + '\' + (Split-Path $out -Leaf), 1.0, 20)
"Region shapes written to $out ($stats)."
"Unassigned land shows in pink in regions-preview.png."
