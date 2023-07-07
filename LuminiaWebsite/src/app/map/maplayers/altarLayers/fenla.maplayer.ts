import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class FenlaLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Fen'La";
  public mapLayer = MapLayerEnum.FenlaAltar;

  constructor(map : L.Map) {
    const iconUrl = FenlaLayer.worldmapImagePath + "icon/fenla.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}


