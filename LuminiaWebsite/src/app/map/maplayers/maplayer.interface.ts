import * as L from "leaflet";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";


export interface IAmMapLayer
{
  isActive : boolean;
  amount: number;
  name: string;
  iconUrl: string;
  getBackgroundColor() : void;
  toggleActive() : void;
  setActive(isActive: boolean) : void;
}

export interface IAmChildMapLayer extends IAmMapLayer
{
  addMarker(markerDto : MarkerDto) : void
  mapLayer: MapLayerEnum;
}

export interface IAmGroupMapLayer extends IAmMapLayer
{
  childLayers: IAmChildMapLayer[];
}

export abstract class MapLayerBase
{
  public static readonly worldmapImagePath: string = "assets/images/worldmap/";
  public amount: number = 0;
  private map: L.Map;
  public layer: L.LayerGroup = new L.LayerGroup();
  public isActive: boolean = true;
  protected zIndex: number =  0;

  constructor(map: L.Map){
    this.map = map;
    this.setActive(this.isActive);
  }

  public getBackgroundColor(): string {

    //Inactive color
    var color: string = "#bdbbb0";

    //Active color
    if(this.isActive)
    {
      color = "#908C7A";
    }

    return color;
  }

  protected setMapState(isActive: boolean) : void{
    if(this.isActive)
    {
      this.layer.addTo(this.map);
    }
    else
    {
      this.layer.removeFrom(this.map);
    }
  }

  protected abstract setActive (isActive: boolean) : void
}

export abstract class GroupMapLayerBase extends MapLayerBase
{
  public childLayers : IAmChildMapLayer[] = [];

  constructor(map: L.Map, childLayers: IAmChildMapLayer[]){
    super(map);
    this.childLayers = childLayers;
    if(childLayers != null)
    {
      childLayers.forEach(childLayer => {
        this.amount += childLayer.amount;
      });
    }
    this.setActive(this.isActive);
  }

  public override setActive (isActive: boolean) : void{
    this.isActive = isActive;
    this.setMapState(this.isActive);

    //Set all the children as well
    if(this.childLayers != null){
      this.childLayers.forEach(childLayer => {
        childLayer.setActive(this.isActive);
      });
    }
  }

  public toggleActive(): void {
    this.isActive = !this.isActive;
    this.setMapState(this.isActive);

    //Toggle all the children as well
    if(this.childLayers != null){
      this.childLayers.forEach(childLayer => {
        childLayer.setActive(this.isActive);
      });
    }
  }
}

//ChildLayers
export abstract class ChildMapLayerBase extends MapLayerBase{
  protected markers: L.Marker[] = [];
  public override setActive (isActive: boolean) : void{
    this.isActive = isActive;
    this.setMapState(this.isActive);
  }

  public toggleActive(): void {
    this.isActive = !this.isActive;
    this.setMapState(this.isActive);
  }

}

export abstract class MultipleIconsMapLayer extends ChildMapLayerBase
{
  public addMarker(markerDto : MarkerDto) : void
  {
    /*
    let icon = L.icon({
      iconUrl: this.iconUrl,
      iconSize: [markerDto.width, markerDto.height],
      iconAnchor: [7.5, 7.5]
    });

    let newMarker = new L.Marker([markerDto.posY, markerDto.posX], {icon: icon});

    //Check if marker has popup or not
    if (markerDto.popupText) {
      newMarker.bindPopup(markerDto.popupText);
    }

    newMarker.addTo(this.layer);
    this.markers.push(newMarker);

    this.amount = this.markers.length;
    */
  }
}

export abstract class SingleIconMapLayer extends ChildMapLayerBase
{
  private icon : L.Icon;

  constructor(map : L.Map, iconUrl: string) {
    super(map);

    this.icon = L.icon({
      iconUrl: iconUrl,
      iconSize: [15,15],
      iconAnchor: [7.5, 7.5]
    });
  }

  public addMarker(markerDto : MarkerDto) : void
  {

    let newMarker = new L.Marker([markerDto.posY, markerDto.posX], {icon: this.icon});

    //Check if marker has popup or not
    if (markerDto.popupText) {
      newMarker.bindPopup(markerDto.popupText);
    }

    newMarker.addTo(this.layer);
    this.markers.push(newMarker);

    this.amount = this.markers.length;
  }
}
