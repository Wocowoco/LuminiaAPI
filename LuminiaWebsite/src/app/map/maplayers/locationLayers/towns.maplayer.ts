import * as L from "leaflet";
import { ChildMapLayerBase, IAmChildMapLayer, IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class TownsLayer extends ChildMapLayerBase implements IAmChildMapLayer
{
  public iconUrl: string = this.worldmapImagePath + "icon/town.png";
  public name: string = "Towns";
  public mapLayer = MapLayerEnum.Town;
  override zIndex = 1000;

  constructor(map: L.Map){
    super(map);
    this.amount = this.markers.length;
  }

  //Icons
  private icon_mizude = L.icon({
    iconUrl: this.worldmapImagePath + "text/mizude.png",
    iconSize: [100,40],
    iconAnchor: [50, 20]
  });

  private icon_valutehas = L.icon({
    iconUrl: this.worldmapImagePath + "text/valutehas.png",
    iconSize: [134,40],
    iconAnchor: [67, 20]
  });

  private icon_dandilly = L.icon({
    iconUrl: this.worldmapImagePath + "text/dandilly.png",
    iconSize: [110,40],
    iconAnchor: [55, 20]
  });

  private icon_zalias = L.icon({
    iconUrl: this.worldmapImagePath + "text/zalias.png",
    iconSize: [88,40],
    iconAnchor: [44, 20]
  });

  //Town Markers
  override markers : L.Marker[] = [
    L.marker([17.957832, 7.097168],{icon: this.icon_mizude}).addTo(this.layer).setZIndexOffset(this.zIndex),
    L.marker([50.485474, -21.42334], {icon: this.icon_valutehas}).addTo(this.layer).setZIndexOffset(this.zIndex),
    L.marker([-3.140516, -75.168457],{icon: this.icon_dandilly}).addTo(this.layer).setZIndexOffset(this.zIndex),
    L.marker([-34.597042, -65.412598], {icon: this.icon_zalias}).addTo(this.layer).setZIndexOffset(this.zIndex),
  ]

  public override addMarker(markerDto: MarkerDto): void {
    //
  }
}

