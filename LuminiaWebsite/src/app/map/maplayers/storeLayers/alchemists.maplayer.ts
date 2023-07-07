import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class AlchemistLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Alchemist";
  public mapLayer = MapLayerEnum.Alchemist;

  constructor(map : L.Map) {
    const iconUrl = AlchemistLayer.worldmapImagePath + "icon/potion.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
