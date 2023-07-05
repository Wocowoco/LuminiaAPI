import * as L from "leaflet";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { MarkerDto } from "src/app/services/luminia-api/dtos/markerdto.interface";


export interface IAmMapLayer
{
  isActive : boolean;
  amount: number;
  name: string;
  mapLayer: MapLayerEnum;
  imageUrl: string;
  childLayers?: IAmMapLayer[];
  getBackgroundColor() : void;
  toggleActive() : void;
  setActive(isActive: boolean) : void;
  addMarker(markerDto : MarkerDto) : void
}

export class MapLayerBase
{
  public readonly worldmapImagePath: string = "assets/images/worldmap/";
  public amount: number = 0;
  private map: L.Map;
  public layer: L.LayerGroup = new L.LayerGroup();
  public isActive: boolean = true;
  protected markers: L.Marker[] = [];
  public childLayers?: IAmMapLayer[];
  protected zIndex: number =  0;

  constructor(map: L.Map, childLayers?: IAmMapLayer[]){
    this.map = map;
    this.childLayers = childLayers;
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

  public addMarker(markerDto : MarkerDto, icon: L.Icon) : void
  {
    let newMarker = new L.Marker([markerDto.posY, markerDto.posX], {icon: icon});

    //Check if marker has popup or not
    if (markerDto.popupText) {
      newMarker.bindPopup(markerDto.popupText);
    }

    newMarker.addTo(this.layer);
    this.markers.push(newMarker);

    this.amount = this.markers.length;
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

  public setActive (isActive: boolean) : void{
    this.isActive = isActive;
    this.setMapState(this.isActive);

    //Set all the children as well
    if(this.childLayers != null){
      this.childLayers.forEach(childLayer => {
        childLayer.setActive(this.isActive);
      });
    }
  }

  private setMapState(isActive: boolean) : void{
    if(this.isActive)
    {
      this.layer.addTo(this.map);
    }
    else
    {
      this.layer.removeFrom(this.map);
    }
  }
}

