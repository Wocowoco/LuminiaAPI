import * as L from "leaflet";
import { GroupMapLayerBase, IAmChildMapLayer, IAmGroupMapLayer, } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class LocationsLayer extends GroupMapLayerBase implements IAmGroupMapLayer
{
  public iconUrl = LocationsLayer.worldmapImagePath + "icon/text.png";
  public name = "Locations";

  constructor(map : L.Map, childLayers: IAmChildMapLayer[]) {
    super(map, childLayers);
  }
}
