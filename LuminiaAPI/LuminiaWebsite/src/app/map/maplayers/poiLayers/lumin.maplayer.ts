import * as L from "leaflet";
import { IAmChildMapLayer, SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class LuminLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Waystone";
  public mapLayer = MapLayerEnum.Lumin;

  constructor(map: L.Map){
    const iconUrl = LuminLayer.worldmapImagePath + "icon/lumin.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Undiscovered Waystone";
  }
}

