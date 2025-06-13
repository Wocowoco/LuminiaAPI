import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(private httpClient: HttpClient) { }

  getLuminariesVisibility () : Observable<boolean> {
    return this.httpClient.get<{showLuminaries: boolean}>('assets/navbar-settings.json', { responseType: 'json' })
      .pipe(
        map((response => response.showLuminaries)));
  }

    getGemstoneExchangeVisibility () : Observable<boolean> {
    return this.httpClient.get<{showGemstoneExchange: boolean}>('assets/navbar-settings.json', { responseType: 'json' })
      .pipe(
        map((response => response.showGemstoneExchange)));
  }
}
