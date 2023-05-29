import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class AmataLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/amata.png";
  public name = "Amata";
  public mapLayer = MapLayerEnum.AmataAltar;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]) {
    super(map, luminiaApiService, layersToControl);
  }

  //Icons
  private amata = L.icon({
    iconUrl: this.worldmapImagePath + "icon/amata.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override async getMarkers() : Promise<void>
  {
    try {
    await super.getMarkers(this.mapLayer, this.amata);
    } catch {
      throw("Connection error");
    }
  }
}
