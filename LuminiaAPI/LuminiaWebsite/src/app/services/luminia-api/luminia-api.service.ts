import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './dtos/item.interface';
import { MapLayerEnum } from './enums/maplayerenum';
import { MarkerDto } from './dtos/markerdto.interface';
import { environment } from 'src/environments/environment';
import { InfernalAlchemyStatsDto } from './dtos/infernalAlchemyStatsDto.interface';
import { CurrentDateDto } from './dtos/currentDateDto.interface';
import { MapNameDto } from './dtos/mapNameDto.interface';
import { GemstoneExchangeDataDto } from './dtos/gemstoneExchangeData.interface';

@Injectable({
  providedIn: 'root'
})
export class LuminiaApiService {

  LuminiaApiURL : string = "";

  constructor(private http: HttpClient) {
    if (environment.production) {
      this.LuminiaApiURL = "https://luminia.be/api/"
    }
    else
    {
      this.LuminiaApiURL = "https://localhost:7276/api/"
    }
  }

  getAllItems(nameFilter: string = "") : Observable<Item[]> {
    return this.http.get<Item[]>(this.LuminiaApiURL + "items" + nameFilter);
  }

  getAllMarkersByLayer(layerFilter: MapLayerEnum) : Observable<MarkerDto[]> {
    return this.http.get<MarkerDto[]>(this.LuminiaApiURL + "markers/" + layerFilter);
  }

  getAllMarkers(showAll: boolean = false) : Observable<MarkerDto[]> {
    if (showAll)
    {
      return this.http.get<MarkerDto[]>(this.LuminiaApiURL + "markers?showAll=true");
    }
    else
    {
      return this.http.get<MarkerDto[]>(this.LuminiaApiURL + "markers");
    }
  }

  getInfernalAlchemyStats() : Observable<InfernalAlchemyStatsDto> {
    return this.http.get<InfernalAlchemyStatsDto>(this.LuminiaApiURL + "infernalalchemy");
  }

  updateGroupPosition(positionX : number, positionY : number) {
    return this.http.patch(this.LuminiaApiURL + "markers/1/position?posX="+positionX+"&posY="+positionY, null);
  }

  getCurrentDate() : Observable<CurrentDateDto> {
    return this.http.get<CurrentDateDto>(this.LuminiaApiURL + "currentdate");
  }

  updateCurrentDate(day : number) {
    return this.http.patch<CurrentDateDto>(this.LuminiaApiURL + "currentdate?day="+day, null);
  }

  getWorldMapName() {
    return this.http.get<MapNameDto>(this.LuminiaApiURL + "mapnames/worldmap");
  }

  getWorldMapDmName() {
    return this.http.get<MapNameDto>(this.LuminiaApiURL + "mapnames/worldmapDM");
  }

  updateWorldMapName(updatedName : string) {
    return this.http.patch<MapNameDto>(this.LuminiaApiURL + "mapnames/worldmap?updatedFolderName="+updatedName, null);
  }

  updateWorldMapDmName(updatedName : string) {
    return this.http.patch<MapNameDto>(this.LuminiaApiURL + "mapnames/worldmapDM?updatedFolderName="+updatedName, null);
  }

  getAllGemstoneExchangeDataForLastDays(days: number) {
    return this.http.get<GemstoneExchangeDataDto[]>(this.LuminiaApiURL + "gemstoneexchanges/graph/"+ days);
  }

  getAllGemstoneExchangeDataHistory() {
    return this.http.get<GemstoneExchangeDataDto[]>(this.LuminiaApiURL + "gemstoneexchanges/history/");
  }
}
