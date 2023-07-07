import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class YuvicLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Yuvic";
  public mapLayer =  MapLayerEnum.YuvicAltar;

  constructor(map : L.Map) {
    const iconUrl = YuvicLayer.worldmapImagePath + "icon/yuvic.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
