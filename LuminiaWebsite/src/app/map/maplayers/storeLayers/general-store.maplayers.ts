import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MapLayerBase, IAmMapLayer } from "../maplayer.interface";
import * as L from "leaflet";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class GeneralStoreLayer extends MapLayerBase implements IAmMapLayer
{

  public imageUrl = this.worldmapImagePath + "icon/generalstore.png";
  public name = "General";
  public readonly mapLayer = MapLayerEnum.GeneralStore;

  constructor(map : L.Map) {
    super(map);
  }

  //Icons
  private icon = L.icon({
    iconUrl: this.worldmapImagePath + "icon/generalstore.png",
    iconSize: [15,15],
    iconAnchor: [7.5, 7.5]
  });

  public override addMarker(markerDto: MarkerDto): void {
    super.addMarker(markerDto, this.icon);
  }
}
