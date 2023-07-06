import * as L from "leaflet";
import { ChildMapLayerBase, IAmChildMapLayer, IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class AtamaLayer extends ChildMapLayerBase implements IAmChildMapLayer
{
  public iconUrl = this.worldmapImagePath + "icon/atama.png";
  public name = "Atama";
  public mapLayer = MapLayerEnum.AtamaAltar;

  constructor(map : L.Map) {
    super(map);
  }

  //Icons
  private icon = L.icon({
    iconUrl: this.iconUrl,
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override addMarker(markerDto: MarkerDto): void {
    super.addMarker(markerDto, this.icon);
  }
}
