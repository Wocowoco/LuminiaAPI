import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class ArcheryLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Archery";
  public mapLayer = MapLayerEnum.Archery;

  constructor(map : L.Map) {
    const iconUrl = ArcheryLayer.worldmapImagePath + "icon/archery.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
