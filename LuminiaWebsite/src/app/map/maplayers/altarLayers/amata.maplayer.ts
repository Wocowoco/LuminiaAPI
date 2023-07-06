import * as L from "leaflet";
import { ChildMapLayerBase, IAmChildMapLayer, IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class AmataLayer extends ChildMapLayerBase implements IAmChildMapLayer
{
  public iconUrl = this.worldmapImagePath + "icon/amata.png";
  public name = "Amata";
  public mapLayer = MapLayerEnum.AmataAltar;

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
