import * as L from "leaflet";
import { IAmChildMapLayer, SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class DungeonsLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Dungeon";
  public mapLayer = MapLayerEnum.Dungeon;

  constructor(map: L.Map){
    const iconUrl = DungeonsLayer.worldmapImagePath + "icon/dungeon.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Dungeon";
  }
}

