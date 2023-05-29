import * as L from "leaflet";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";
import { LuminiaApiService } from "src/app/services/luminia-api/luminia-api.service";
import { firstValueFrom } from 'rxjs';


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
  getMarkers(): Promise<void>;
}

export class MapLayerBase
{
  public readonly worldmapImagePath: string = "assets/images/worldmap/";
  public amount: number = 0;
  private luminiaApiService : LuminiaApiService;
  private map: L.Map;
  public layer: L.LayerGroup = new L.LayerGroup();
  public isActive: boolean = true;
  protected markers: L.Marker[] = [];
  public childLayers?: IAmMapLayer[];
  protected zIndex: number =  0;

  constructor(map: L.Map, luminiaApiService: LuminiaApiService, layersToControl?: IAmMapLayer[]){
    this.map = map;
    this.luminiaApiService = luminiaApiService;
    this.childLayers = layersToControl;
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

  public async getMarkers(mapLayer: MapLayerEnum, icon: L.Icon): Promise<void> {
    //Get all of this layer's markers
    try{
      const markers$ = this.luminiaApiService.getAllMarkersByLayer(mapLayer);
      let markerDtos = await firstValueFrom(markers$);

      markerDtos.forEach(marker => {
        let newMarker = new L.Marker([marker.posY, marker.posX], {icon: icon});

        //Check if marker has popup or not
        if (marker.popupText) {
          newMarker.bindPopup(marker.popupText);
        }

        newMarker.addTo(this.layer);
        this.markers.push(newMarker);
      });
      this.amount = this.markers.length;

    } catch(e) {
      throw("Connection error");
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

