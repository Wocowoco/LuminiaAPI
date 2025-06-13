import { Component, OnInit } from '@angular/core';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { MapLayerEnum } from '../services/luminia-api/enums/maplayerenum';
import { first, firstValueFrom } from 'rxjs';
import { MarkerDto } from '../services/luminia-api/dtos/markerdto.interface';
import { DateFormatterService } from '../helpers/date-formatter.service';

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

  currentDayText : string = "Loading...";
  currentDayNumber : number = 0;

  private groupMarker : MarkerDto | undefined;

  oldFolderName : string = '';
  oldFolderNameDM : string = '';
  folderName : string = '';
  folderNameDM : string = '';

  constructor(private luminiaApiService: LuminiaApiService, private dateFormatterService : DateFormatterService) {
  }

  async ngOnInit(): Promise<void> {
    // Get current party position
    await this.getCurrentPosition();
    await this.getCurrentDay();
    await this.getCurrentFolderNames();
  }

  async updateGroupPosition() {
    const updateGroupPosition$ = this.luminiaApiService.updateGroupPosition(this.positionX, this.positionY);
    await firstValueFrom(updateGroupPosition$);
    await this.getCurrentPosition();
  }

  async updateToNextDay() {
    // Set day counter + 1
    const updateCurrentDay$ = this.luminiaApiService.updateCurrentDate(this.currentDayNumber + 1);
    await firstValueFrom(updateCurrentDay$);

    // Update Gemstone Exchange
    const updateGemstoneExchange$ = this.luminiaApiService.updateGemstoneExchange(this.currentDayNumber + 1);
    await firstValueFrom(updateGemstoneExchange$);

    // Update display in front end
    await this.getCurrentDay();
  }

  async updateMapFolderName() {
    const updateWorldMapName$ = this.luminiaApiService.updateWorldMapName(this.folderName);
    await firstValueFrom(updateWorldMapName$);

    await this.getCurrentFolderNames();
  }

  async updateMapDmFolderName() {
    const updateWorldMapNameDm$ = this.luminiaApiService.updateWorldMapDmName(this.folderNameDM);
    await firstValueFrom(updateWorldMapNameDm$);

    await this.getCurrentFolderNames();
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

    this.currentDayNumber = currentDayDto.dayNumber;
    this.currentDayText = this.dateFormatterService.formatDaynumberToString(this.currentDayNumber);
  }

  async getCurrentFolderNames() {
    const folderNameWorldMap$ = this.luminiaApiService.getWorldMapName();
    const folderNameWorldMapDM$ = this.luminiaApiService.getWorldMapDmName();
    var folderNameWorldMap = await firstValueFrom(folderNameWorldMap$);
    var folderNameWorldMapDM = await firstValueFrom(folderNameWorldMapDM$);

    this.oldFolderName = folderNameWorldMap.nameOfFolder;
    this.oldFolderNameDM = folderNameWorldMapDM.nameOfFolder;
    this.folderName = this.oldFolderName;
    this.folderNameDM = this.oldFolderNameDM;
  }

}
