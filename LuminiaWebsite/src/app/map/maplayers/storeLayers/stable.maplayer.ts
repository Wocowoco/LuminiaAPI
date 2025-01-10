import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class StableLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Stable";
  public mapLayer = MapLayerEnum.Stable;

  constructor(map : L.Map) {
    const iconUrl = StableLayer.worldmapImagePath + "icon/stable.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Stable";
  }
}
