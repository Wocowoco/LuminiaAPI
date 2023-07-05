import * as L from "leaflet";
import { IAmMapLayer, MapLayerBase } from "../maplayer.interface";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";

export class RegionsLayer extends MapLayerBase implements IAmMapLayer
{
  public imageUrl: string = this.worldmapImagePath + "icon/region.png";
  public name: string = "Regions";
  public mapLayer = MapLayerEnum.Region;

  constructor(map: L.Map){
    super(map);
    this.amount = this.markers.length;
  }

  //Icons
  private alodia = L.icon({
    iconUrl: this.worldmapImagePath + "text/alodia.png",
    iconSize: [80,20],
    iconAnchor: [40, 10]
  });

  private myrill = L.icon({
    iconUrl: this.worldmapImagePath + "text/myrill.png",
    iconSize: [69,25],
    iconAnchor: [36.5, 12.5]
  });

  private chornederev = L.icon({
    iconUrl: this.worldmapImagePath + "text/chornederev.png",
    iconSize: [177,20],
    iconAnchor: [88.5, 10]
  });

  private aritunn = L.icon({
    iconUrl: this.worldmapImagePath + "text/aritunn.png",
    iconSize: [96,20],
    iconAnchor: [47, 10]
  });

  private northpaikka = L.icon({
    iconUrl: this.worldmapImagePath + "text/northpaikka.png",
    iconSize: [164,20],
    iconAnchor: [82, 10]
  });


  //Town Markers
  override markers : L.Marker[] = [
    L.marker([9.903921, 1.40625],{icon: this.alodia}).addTo(this.layer),
    L.marker([48.327039, 5.932617],{icon: this.chornederev}).addTo(this.layer),
    L.marker([53.028, -91.340332],{icon: this.aritunn}).addTo(this.layer),
    L.marker([19.103648, -63.500977],{icon: this.northpaikka}).addTo(this.layer),
    L.marker([-49.482401, -90.966797],{icon: this.myrill}).addTo(this.layer),
  ]

  public override addMarker(markerDto: MarkerDto): void {
    //
  }
}

