import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class StoresLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl = this.worldmapImagePath + "icon/store.png";
  public name = "Stores";
  public mapLayer = MapLayerEnum.None;

  constructor(map : L.Map, childLayers?: IAmMapLayer[]) {
    super(map, childLayers);
    if(childLayers != null)
    {
      childLayers.forEach(childLayer => {
        this.amount += childLayer.amount;
      });
    }
  }

  public override addMarker(markerDto: MarkerDto): void {
    //
  }
}
