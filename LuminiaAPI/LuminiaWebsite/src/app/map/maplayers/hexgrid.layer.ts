import * as L from "leaflet";

export const HEX_KM = 10;

export interface TravelPace {
  name: string;
  kmPerDay: number;
  hexesPerDay: number;
}

// D&D travel paces (18 / 24 / 30 miles a day) rounded to metric, counted in 10 km hexes.
export const TRAVEL_PACES: TravelPace[] = [
  { name: "Slow", kmPerDay: 30, hexesPerDay: 30 / HEX_KM },
  { name: "Normal", kmPerDay: 40, hexesPerDay: 40 / HEX_KM },
  { name: "Fast", kmPerDay: 50, hexesPerDay: 50 / HEX_KM },
];

// Map scale, in map pixels at zoom 6 (the top native tile zoom).
// Set by the DM: the road from Mizude to Esther's Crossing (one day at normal pace) is about 40 km,
// and that road is ~760 px long (the two towns are ~580 px apart in a straight line).
export const PX_PER_KM = 760 / 40;
const HEX_PX = HEX_KM * PX_PER_KM;
export const REFERENCE_ZOOM = 6;

// The grid is anchored so one hex is centred on 0,0 (where the position marker starts).
const GRID_ORIGIN = L.latLng(0, 0);

// Below this on-screen hex size the grid is too dense to be useful, so it isn't drawn.
const MIN_HEX_SCREEN_PX = 14;

/**
 * Flat-topped hex grid of 10 km hexes (centre to neighbouring centre).
 * Drawn on canvas tiles, so it stays cheap at every zoom level.
 */
export class HexGridLayer extends L.GridLayer {
  private readonly hexPx = HEX_PX;

  constructor() {
    super({ noWrap: true, zIndex: 10, updateWhenZooming: false });
  }

  protected override createTile(coords: L.Coords): HTMLElement {
    const tile = document.createElement("canvas");
    const size = this.getTileSize();
    const dpr = window.devicePixelRatio || 1;
    tile.width = size.x * dpr;
    tile.height = size.y * dpr;

    // Reference-zoom pixels per tile pixel at this zoom.
    const f = Math.pow(2, REFERENCE_ZOOM - coords.z);
    if (this.hexPx / f < MIN_HEX_SCREEN_PX) {
      return tile;
    }

    const ctx = tile.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const origin = this._map.project(GRID_ORIGIN, REFERENCE_ZOOM);
    const h = this.hexPx;                 // distance between neighbouring centres (flat to flat)
    const r = h / Math.sqrt(3);           // corner radius
    const colStep = 1.5 * r;

    const x0 = coords.x * size.x * f;
    const y0 = coords.y * size.y * f;
    const x1 = x0 + size.x * f;
    const y1 = y0 + size.y * f;

    const firstCol = Math.floor((x0 - origin.x - r) / colStep);
    const lastCol = Math.ceil((x1 - origin.x + r) / colStep);
    const firstRow = Math.floor((y0 - origin.y) / h) - 1;
    const lastRow = Math.ceil((y1 - origin.y) / h) + 1;

    // One path for all hexes, so shared edges aren't stroked twice.
    ctx.beginPath();
    for (let col = firstCol; col <= lastCol; col++) {
      const cx = origin.x + col * colStep;
      const rowOffset = ((col % 2) + 2) % 2 === 1 ? h / 2 : 0;
      for (let row = firstRow; row <= lastRow; row++) {
        const cy = origin.y + row * h + rowOffset;
        for (let k = 0; k <= 6; k++) {
          const angle = Math.PI / 3 * k;
          const px = (cx + r * Math.cos(angle) - x0) / f;
          const py = (cy + r * Math.sin(angle) - y0) / f;
          if (k === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
    }

    ctx.lineJoin = "round";
    // Dark halo under a light line, so the grid reads on both sea and land.
    ctx.strokeStyle = "rgba(44, 43, 37, 0.3)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(251, 251, 242, 0.65)";
    ctx.lineWidth = 1;
    ctx.stroke();

    return tile;
  }
}
