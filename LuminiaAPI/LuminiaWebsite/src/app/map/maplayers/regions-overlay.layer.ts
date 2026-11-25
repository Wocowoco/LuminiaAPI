import * as L from "leaflet";
import { REFERENCE_ZOOM } from "./hexgrid.layer";

// Region shapes, traced from the DM's region map (worldmap_regions.jpg, 18072 x 13753 px, not in git) by
// scripts/region-overlay/Build-RegionOverlay.ps1. Points are in region-map pixels, which line up with the tiles as
//   tile pixel at zoom 6 = region-map pixel * SCALE + OFFSET
// (found by matching the lakes and rivers of Alodia on both maps).
const REGIONS_URL = "assets/regions.json";
const SCALE = 1.0175;
const OFFSET_X = -932;
const OFFSET_Y = 1890;

interface RegionShape {
  name: string;
  color: [number, number, number];
  rings: [number, number][][];
}

// Region names, placed where they're written on the region map (region-map pixels).
const REGION_LABELS: { name: string; x: number; y: number }[] = [
  { name: "Aritunn", x: 4852, y: 3542 },
  { name: "Chorne Derev", x: 9262, y: 3795 },
  { name: "North Paikka", x: 5783, y: 5033 },
  { name: "Tikushi", x: 3931, y: 6244 },
  { name: "Myrill", x: 4744, y: 8385 },
  { name: "South Paikka", x: 7337, y: 6723 },
  { name: "Alodia", x: 9352, y: 5819 },
  { name: "Rilsonia", x: 11593, y: 4889 },
  { name: "Sinawiran", x: 9551, y: 7500 },
  { name: "Sinawiran", x: 6524, y: 8611 },
  { name: "Kewara", x: 10961, y: 7581 },
];

const FILL_OPACITY = 0.35;

// Colours shown on the map, where they differ from the border colour on the region map. Regions that
// belong together get matching colours: Alodia belongs to Rilsonia (purples), and North and South Paikka
// used to be one land (off-whites).
const DISPLAY_COLORS: Record<string, [number, number, number]> = {
  "North Paikka": [228, 220, 204],
  "South Paikka": [250, 246, 240],
  "Rilsonia": [170, 40, 230],
  "Alodia": [126, 72, 214],
};

/** The world's regions as coloured vector shapes with their names (display only). Loads the shapes the first time it's shown. */
export class RegionsOverlayLayer {
  private readonly layer = L.layerGroup();
  private loading: Promise<void> | undefined;

  constructor(private map: L.Map) {
    for (const label of REGION_LABELS) {
      L.marker(this.toLatLng(label.x, label.y), {
        icon: L.divIcon({ className: "region-label", html: `<span>${label.name}</span>`, iconSize: [0, 0] }),
        interactive: false,
        keyboard: false,
        zIndexOffset: -1000,
      }).addTo(this.layer);
    }
  }

  public setVisible(visible: boolean): void {
    if (visible) {
      this.layer.addTo(this.map);
      this.loading ??= this.loadShapes();
    } else {
      this.layer.remove();
    }
  }

  private async loadShapes(): Promise<void> {
    try {
      const response = await fetch(REGIONS_URL);
      const data: { regions: RegionShape[] } = await response.json();
      for (const region of data.regions) {
        const color = `rgb(${(DISPLAY_COLORS[region.name] ?? region.color).join(",")})`;
        const rings = region.rings.map(ring => ring.map(([x, y]) => this.toLatLng(x, y)));
        // One polygon per region: its islands and any lakes are extra rings (drawn with the even-odd rule).
        // Not interactive: clicks and hovers go straight through to the map and its markers.
        L.polygon(rings, {
          color, weight: 2, opacity: 0.9, fillColor: color, fillOpacity: FILL_OPACITY, smoothFactor: 1.5, interactive: false,
        }).addTo(this.layer);
      }
    } catch {
      this.loading = undefined; // try again next time the overlay is turned on
    }
  }

  private toLatLng(x: number, y: number): L.LatLng {
    return this.map.unproject(L.point(x * SCALE + OFFSET_X, y * SCALE + OFFSET_Y), REFERENCE_ZOOM);
  }
}
