import * as L from "leaflet";
import { GroupMapLayerBase, IAmChildMapLayer, IAmGroupMapLayer} from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class PointsOfInterestLayer extends GroupMapLayerBase implements IAmGroupMapLayer
{
  public iconUrl = PointsOfInterestLayer.worldmapImagePath + "icon/poi.png";
  public name = "Points of Interest";

  constructor(map : L.Map, childLayers: IAmChildMapLayer[]) {
    super(map, childLayers);
  }
}
