import * as L from "leaflet";
import { IAmChildMapLayer, MultipleIconsMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class TownsLayer extends MultipleIconsMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Town";
  public mapLayer = MapLayerEnum.Town;
  override zIndex = 1000;

  constructor(map: L.Map){
    super(map);
    this.amount = this.markers.length;
    this.iconUrl = TownsLayer.worldmapImagePath + "icon/town.png";
  }
}

