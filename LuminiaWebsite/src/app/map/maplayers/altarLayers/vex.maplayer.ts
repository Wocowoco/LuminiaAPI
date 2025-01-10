import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class VexLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Vex";
  public mapLayer = MapLayerEnum.VexAltar;

  constructor(map : L.Map) {
    const iconUrl = VexLayer.worldmapImagePath + "icon/vex.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Vex Altar";
  }
}
