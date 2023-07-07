import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class BlacksmithLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Blacksmith";
  public mapLayer = MapLayerEnum.Blacksmith;

  constructor(map : L.Map) {
    const iconUrl = BlacksmithLayer.worldmapImagePath + "icon/blacksmith.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
