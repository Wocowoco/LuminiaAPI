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

  oldCurrentDay : number = 0;
  currentDay : number = 0;
  currentDayAsDayMonth : string = '';

  private groupMarker : MarkerDto | undefined;

  constructor(private luminiaApiService: LuminiaApiService) {
  }

  async ngOnInit(): Promise<void> {
    // Get current party position
    await this.getCurrentPosition();
    await this.getCurrentDay();
  }

  async updateGroupPosition() {
    const updateGroupPosition$ = this.luminiaApiService.updateGroupPosition(this.positionX, this.positionY);
    await firstValueFrom(updateGroupPosition$);
    await this.getCurrentPosition();
  }

  async updateCurrentDay() {
    const updateCurrentDay$ = this.luminiaApiService.updateCurrentDate(this.currentDay);
    await firstValueFrom(updateCurrentDay$);
    await this.getCurrentDay();
  }

  async getCurrentPosition() {
    const markerPosition$ = this.luminiaApiService.getAllMarkersByLayer(MapLayerEnum.Group);
    var markerPosition = await firstValueFrom(markerPosition$);

    this.groupMarker = markerPosition[0];
    this.positionX = this.groupMarker.posX;
    this.positionY = this.groupMarker.posY;
    this.oldX = this.positionX;
    this.oldY = this.positionY;
  }

  async getCurrentDay() {
    const currentDay$ = this.luminiaApiService.getCurrentDate();
    var currentDayDto = await firstValueFrom(currentDay$);

    this.oldCurrentDay = currentDayDto.day;
    this.currentDay = this.oldCurrentDay;

    var dayInMonth: number;
    var daySuffix: string;
    var monthText: string;

    switch (Math.floor((this.oldCurrentDay - 1) / 91)) {
      case 0:
        monthText = 'Bloomen';
        dayInMonth = this.oldCurrentDay;
        break;
      case 1:
        monthText = 'Sumsun';
        dayInMonth = this.oldCurrentDay - 91;
        break;
      case 2:
        monthText = 'Leaflet';
        dayInMonth = this.oldCurrentDay - 182;
        break;
      case 3:
        monthText = 'Frizwa';
        dayInMonth = this.oldCurrentDay - 273;
        break;
      default:
        monthText = '???';
        dayInMonth = 0;
        break;
    }

    this.currentDayAsDayMonth = dayInMonth.toString() + " " + monthText;
  }

}
