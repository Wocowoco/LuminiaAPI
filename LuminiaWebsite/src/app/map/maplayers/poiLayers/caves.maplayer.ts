import * as L from "leaflet";
import { IAmChildMapLayer, SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class CavesLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Cave";
  public mapLayer = MapLayerEnum.Cave;

  constructor(map: L.Map){
    const iconUrl = CavesLayer.worldmapImagePath + "icon/cave.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Cave";
  }
}

