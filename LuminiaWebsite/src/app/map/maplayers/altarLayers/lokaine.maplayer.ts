import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class LokaineLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Lokaine";
  public mapLayer = MapLayerEnum.LokaineAltar;

  constructor(map : L.Map) {
    const iconUrl = LokaineLayer.worldmapImagePath + "icon/lokaine.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Lokaine Altar";
  }
}
