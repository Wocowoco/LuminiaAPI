import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class KrigonLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Krigon";
  public mapLayer = MapLayerEnum.KrigonAltar;

  constructor(map : L.Map) {
    const iconUrl = KrigonLayer.worldmapImagePath + "icon/krigon.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
