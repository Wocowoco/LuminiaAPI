import * as L from "leaflet";
import { GroupMapLayerBase, IAmChildMapLayer, IAmGroupMapLayer, IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class AltarsLayer extends GroupMapLayerBase implements IAmGroupMapLayer
{
  public iconUrl = this.worldmapImagePath + "icon/altar.png";
  public name = "Places of Worship";
  public mapLayer = MapLayerEnum.None;

  constructor(map : L.Map, childLayers: IAmChildMapLayer[]) {
    super(map, childLayers);
  }
}
