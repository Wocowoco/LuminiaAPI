import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class TaoidesLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Taoides";
  public mapLayer = MapLayerEnum.TaoidesAltar;

  constructor(map : L.Map) {
    const iconUrl = TaoidesLayer.worldmapImagePath + "icon/taoides.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Taoides Altar";
  }
}
