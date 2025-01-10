import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './dtos/item.interface';
import { MapLayerEnum } from './enums/maplayerenum';
import { MarkerDto } from './dtos/markerdto.interface';
import { environment } from 'src/environments/environment';

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
}
