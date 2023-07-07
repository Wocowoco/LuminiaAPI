import * as L from "leaflet";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class VaknorLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Vak'Nor";
  public mapLayer =  MapLayerEnum.VaknorAltar;

  constructor(map : L.Map) {
    const iconUrl = VaknorLayer.worldmapImagePath + "icon/vaknor.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
  }
}
