import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class CaraLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Cara";
  public mapLayer = MapLayerEnum.CaraAltar;

  constructor(map : L.Map) {
    const iconUrl = CaraLayer.worldmapImagePath + "icon/cara.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Cara Altar";
  }
}
