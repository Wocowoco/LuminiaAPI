import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class BankLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "Bank";
  public mapLayer = MapLayerEnum.Bank;

  constructor(map : L.Map) {
    const iconUrl = BankLayer.worldmapImagePath + "icon/store.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Bank";
  }
}
