import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './dtos/item.interface';
import { MapLayerEnum } from './enums/maplayerenum';
import { MarkerDto } from './dtos/markerdto.interface';

@Injectable({
  providedIn: 'root'
})
export class LuminiaApiService {

  LuminiaApiURL : string = "http://luminia.be/api/"

  constructor(private http: HttpClient) { }

  getAllItems(nameFilter: string = "") : Observable<Item[]> {
    return this.http.get<Item[]>(this.LuminiaApiURL + "items" + nameFilter);
  }

  getAllMarkersByLayer(layerFilter: MapLayerEnum) : Observable<MarkerDto[]> {
    return this.http.get<MarkerDto[]>(this.LuminiaApiURL + "markers/" + layerFilter);
  }
}
