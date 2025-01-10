import * as L from "leaflet";
import { IAmChildMapLayer, MultipleIconsMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class RegionsLayer extends MultipleIconsMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Region";
  public mapLayer = MapLayerEnum.Region;

  constructor(map: L.Map){
    super(map);
    this.amount = this.markers.length;
    this.iconUrl = RegionsLayer.worldmapImagePath + "icon/region.png";
  }
}

