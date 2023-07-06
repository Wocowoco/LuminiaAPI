import * as L from "leaflet";
import { GroupMapLayerBase, IAmChildMapLayer, IAmGroupMapLayer} from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class StoresLayer extends GroupMapLayerBase implements IAmGroupMapLayer
{
  public iconUrl = this.worldmapImagePath + "icon/store.png";
  public name = "Stores";
  public mapLayer = MapLayerEnum.None;

  constructor(map : L.Map, childLayers: IAmChildMapLayer[]) {
    super(map, childLayers);
  }
}
