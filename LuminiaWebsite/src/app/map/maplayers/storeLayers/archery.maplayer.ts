import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MapLayerBase, IAmMapLayer, ChildMapLayerBase, IAmChildMapLayer } from "../maplayer.interface";

import * as L from "leaflet";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class ArcheryLayer extends ChildMapLayerBase implements IAmChildMapLayer
{
  public iconUrl = this.worldmapImagePath + "icon/archery.png";
  public name = "Archery";
  public mapLayer = MapLayerEnum.Archery;

  constructor(map : L.Map) {
    super(map);
  }

  private icon = L.icon({
    iconUrl: this.iconUrl,
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override addMarker(markerDto: MarkerDto): void {
    super.addMarker(markerDto, this.icon);
  }
}
