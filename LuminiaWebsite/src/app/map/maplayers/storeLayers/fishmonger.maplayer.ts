import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class FishmongerLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Fishmonger";
  public mapLayer = MapLayerEnum.Fishmonger;

  constructor(map : L.Map) {
    const iconUrl = FishmongerLayer.worldmapImagePath + "icon/fishmonger.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Fishmonger";
  }
}
