import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class VaknorLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/vaknor.png";
  public name = "Vak'Nor";
  public mapLayer =  MapLayerEnum.VaknorAltar;

  constructor(map : L.Map) {
    super(map);
  }
  //Icons
  private icon = L.icon({
    iconUrl: this.worldmapImagePath + "icon/vaknor.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override addMarker(markerDto: MarkerDto): void {
    super.addMarker(markerDto, this.icon);
  }
}
