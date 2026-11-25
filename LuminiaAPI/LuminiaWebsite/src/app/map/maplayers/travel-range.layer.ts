import * as L from "leaflet";
import { PX_PER_KM, REFERENCE_ZOOM } from "./hexgrid.layer";

const CIRCLE_POINTS = 96;

/**
 * Circle around the group's position showing how far they get in one full day of travel
 * (straight line, at the chosen pace).
 *
 * Built as a polygon in map-pixel space rather than an L.Circle, because L.Circle measures in
 * real-world metres and would be stretched by the map's Web Mercator projection.
 */
export class TravelRangeLayer {
  private readonly ring = L.polygon([], {
    color: "#fbfbf2",
    weight: 2.5,
    opacity: 0.9,
    fillColor: "#fbfbf2",
    fillOpacity: 0.08,
    interactive: false,
  });
  private readonly halo = L.polygon([], {
    color: "#2c2b25",
    weight: 5,
    opacity: 0.35,
    fill: false,
    interactive: false,
  });

  constructor(private map: L.Map) {}

  /** Draws the ring around `center`, or hides it when there's no center or it's turned off. */
  public update(center: L.LatLng | undefined, kmPerDay: number, visible: boolean): void {
    if (!visible || !center) {
      this.halo.remove();
      this.ring.remove();
      return;
    }

    const c = this.map.project(center, REFERENCE_ZOOM);
    const radius = kmPerDay * PX_PER_KM;
    const points: L.LatLng[] = [];
    for (let i = 0; i < CIRCLE_POINTS; i++) {
      const angle = 2 * Math.PI * i / CIRCLE_POINTS;
      points.push(this.map.unproject(L.point(c.x + radius * Math.cos(angle), c.y + radius * Math.sin(angle)), REFERENCE_ZOOM));
    }

    this.halo.setLatLngs(points).addTo(this.map);
    this.ring.setLatLngs(points).addTo(this.map);
  }
}
