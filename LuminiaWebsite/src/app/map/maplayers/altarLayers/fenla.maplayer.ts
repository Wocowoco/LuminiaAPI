import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class FenlaLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/fenla.png";
  public name = "Fen'La";
  public mapLayer = MapLayerEnum.FenlaAltar;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]) {
    super(map, luminiaApiService, layersToControl);
  }

  //Icons
  private fenla = L.icon({
    iconUrl: this.worldmapImagePath + "icon/fenla.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override async getMarkers() : Promise<void>
  {
    await super.getMarkers(this.mapLayer, this.fenla);
  }
}


