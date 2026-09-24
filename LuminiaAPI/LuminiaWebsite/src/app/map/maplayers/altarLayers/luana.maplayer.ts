import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class LuanaLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Luana";
  public mapLayer = MapLayerEnum.LuanaAltar;

  constructor(map : L.Map) {
    const iconUrl = LuanaLayer.worldmapImagePath + "icon/luana.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Luana Altar";
  }
}
