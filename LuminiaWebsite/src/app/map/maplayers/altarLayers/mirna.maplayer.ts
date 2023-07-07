import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class MirnaLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Mirna";
  public mapLayer = MapLayerEnum.MirnaAltar;

  constructor(map : L.Map) {
    const iconUrl = MirnaLayer.worldmapImagePath + "icon/mirna.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
