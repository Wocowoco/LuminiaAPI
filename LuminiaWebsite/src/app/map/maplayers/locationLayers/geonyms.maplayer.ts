import * as L from "leaflet";
import { IAmChildMapLayer, MultipleIconsMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class GeonymsLayer extends MultipleIconsMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Geonym";
  public mapLayer = MapLayerEnum.Geonym;

  constructor(map: L.Map){
    super(map);
    this.isHiddenWhenZoomedOut = true;
    this.amount = this.markers.length;
    this.iconUrl = GeonymsLayer.worldmapImagePath + "icon/geonym.png";
  }
}

