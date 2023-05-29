import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";

export class LokaineLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/lokaine.png";
  public name = "Lokaine";
  public mapLayer = MapLayerEnum.LokaineAltar;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]) {
    super(map, luminiaApiService, layersToControl);
  }

  //Icons
  private lokaine = L.icon({
    iconUrl: this.worldmapImagePath + "icon/lokaine.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override async getMarkers() : Promise<void>
  {
    await super.getMarkers(this.mapLayer, this.lokaine);
  }
}
