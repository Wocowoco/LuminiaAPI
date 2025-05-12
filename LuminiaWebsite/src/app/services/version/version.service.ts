import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private httpClient: HttpClient) { }

  getVersion () : Observable<string> {
    return this.httpClient.get<{version: string}>('assets/version.json', { responseType: 'json' })
      .pipe(
        map((response => response.version)));
  }
}
