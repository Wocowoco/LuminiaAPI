import { Component, OnInit } from '@angular/core';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { MapLayerEnum } from '../services/luminia-api/enums/maplayerenum';
import { first, firstValueFrom } from 'rxjs';
import { MarkerDto } from '../services/luminia-api/dtos/markerdto.interface';

@Component({
  selector: 'app-dm-page',
  templateUrl: './dm-page.component.html',
  styleUrls: ['./dm-page.component.css']
})
export class DmPageComponent implements OnInit {

  positionX : number = 0.00;
  positionY : number = 0.00;
  oldX : number = 0.00;
  oldY : number = 0.00;

  private groupMarker : MarkerDto | undefined;

  constructor(private luminiaApiService: LuminiaApiService) {
  }

  async ngOnInit(): Promise<void> {
    // Get current party position
    await this.getCurrentPosition();
  }

  async updateGroupPosition(){
    const updateGrouPosition$ = this.luminiaApiService.updateGroupPosition(this.positionX, this.positionY);
    await firstValueFrom(updateGrouPosition$);
    await this.getCurrentPosition();
  }

  async getCurrentPosition()
  {
    const markerPosition$ = this.luminiaApiService.getAllMarkersByLayer(MapLayerEnum.Group);
    var markerPosition = await firstValueFrom(markerPosition$);

    this.groupMarker = markerPosition[0];
    this.positionX = this.groupMarker.posX;
    this.positionY = this.groupMarker.posY;
    this.oldX = this.positionX;
    this.oldY = this.positionY;
  }

}
