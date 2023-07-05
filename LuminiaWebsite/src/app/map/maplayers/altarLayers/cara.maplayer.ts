import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class CaraLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/cara.png";
  public name = "Cara";
  public mapLayer = MapLayerEnum.CaraAltar;

  constructor(map : L.Map) {
    super(map);
  }

  //Icons
  private icon = L.icon({
    iconUrl: this.worldmapImagePath + "icon/cara.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override addMarker(markerDto: MarkerDto): void {
    super.addMarker(markerDto, this.icon);
  }
}
