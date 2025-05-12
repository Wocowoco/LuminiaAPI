import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LuminaryVisibility } from 'src/app/luminary/luminary-visibility.enum';

@Injectable({
  providedIn: 'root'
})
export class LuminaryService {

  constructor(private httpClient: HttpClient) { }

    getLuminariesVisibility () : Observable<boolean> {
      return this.httpClient.get<{showLuminaries: boolean}>('assets/luminary-settings.json', { responseType: 'json' })
        .pipe(
          map((response => response.showLuminaries)));
    }

    getSwirlingMoon () : Observable<LuminaryVisibility> {
      return this.httpClient.get<{swirlingMoon: LuminaryVisibility}>('assets/luminary-settings.json', { responseType: 'json' })
        .pipe(
          map((response => response.swirlingMoon)));
    }

    getSunKhopesh () : Observable<LuminaryVisibility> {
      return this.httpClient.get<{sunKhopesh: LuminaryVisibility}>('assets/luminary-settings.json', { responseType: 'json' })
        .pipe(
          map((response => response.sunKhopesh)));
    }
}
