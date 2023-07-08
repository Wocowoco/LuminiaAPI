import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { IAmChildMapLayer,  SingleIconMapLayer } from "../maplayer.interface";
import * as L from "leaflet";

export class GeneralStoreLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name = "General";
  public readonly mapLayer = MapLayerEnum.GeneralStore;

  constructor(map : L.Map) {
    const iconUrl = GeneralStoreLayer.worldmapImagePath + "icon/generalstore.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "General Store";
  }
}
