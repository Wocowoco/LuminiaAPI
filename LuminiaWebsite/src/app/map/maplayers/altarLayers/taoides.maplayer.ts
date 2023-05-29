import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";

export class TaoidesLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/taoides.png";
  public name = "Taoides";
  public mapLayer = MapLayerEnum.TaoidesAltar;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]) {
    super(map, luminiaApiService, layersToControl);
  }

  //Icons
  private taoides = L.icon({
    iconUrl: this.worldmapImagePath + "icon/taoides.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override async getMarkers() : Promise<void>
  {
    await super.getMarkers(this.mapLayer, this.taoides);
  }
}
