import * as L from "leaflet";
import { GroupMapLayerBase, IAmChildMapLayer, IAmGroupMapLayer} from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class AltarsLayer extends GroupMapLayerBase implements IAmGroupMapLayer
{
  public iconUrl = AltarsLayer.worldmapImagePath + "icon/altar.png";
  public name = "Places of Worship";

  constructor(map : L.Map, childLayers: IAmChildMapLayer[]) {
    super(map, childLayers);
  }
}
