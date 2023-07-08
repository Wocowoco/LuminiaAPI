import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class AmataLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Amata";
  public mapLayer = MapLayerEnum.AmataAltar;

  constructor(map : L.Map) {
    const iconUrl = AmataLayer.worldmapImagePath + "icon/amata.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Amata Altar";
  }
}
