import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";

export class MirnaLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/mirna.png";
  public name = "Mirna";
  public mapLayer = MapLayerEnum.MirnaAltar;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]) {
    super(map, luminiaApiService, layersToControl);
  }

  //Icons
  private mirna = L.icon({
    iconUrl: this.worldmapImagePath + "icon/mirna.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override async getMarkers() : Promise<void>
  {
    await super.getMarkers(this.mapLayer, this.mirna);
  }
}
