import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class AtamaLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Atama";
  public mapLayer = MapLayerEnum.AtamaAltar;

  constructor(map : L.Map) {
    const iconUrl = AtamaLayer.worldmapImagePath + "icon/atama.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
