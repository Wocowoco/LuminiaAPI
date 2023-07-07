import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class KazLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Kaz";
  public mapLayer = MapLayerEnum.KazAltar;

  constructor(map : L.Map) {
    const iconUrl = KazLayer.worldmapImagePath + "icon/kaz.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
