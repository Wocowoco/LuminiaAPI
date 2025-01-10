import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class InnLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Inn";
  public mapLayer = MapLayerEnum.Inn;

  constructor(map : L.Map) {
    const iconUrl = InnLayer.worldmapImagePath + "icon/inn.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Inn";
  }
}
