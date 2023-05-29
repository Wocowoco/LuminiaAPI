import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "./maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";

export class AltarsLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/altar.png";
  public name = "Places of Worship";
  public mapLayer = MapLayerEnum.None;

  constructor(map : L.Map, luminiaApiService: LuminiaApiService, childLayers?: IAmMapLayer[]) {
    super(map, luminiaApiService, childLayers);
    if(childLayers != null)
    {
      childLayers.forEach(childLayer => {
        this.amount += childLayer.amount;
      });
    }
  }

  public override async getMarkers() : Promise<void>
  {
    //
  }
}
