import { Component, HostListener, OnInit } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { GemstoneExchangeDataDto } from '../services/luminia-api/dtos/gemstoneExchangeData.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ErrorSnackbarComponent } from '../snackbars/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-gemstone-exchange',
  templateUrl: './gemstone-exchange.component.html',
  styleUrls: ['./gemstone-exchange.component.css']
})
export class GemstoneExchangeComponent implements OnInit {

  legendPosition : LegendPosition = LegendPosition.Below;
  view: [number, number] = [window.innerWidth * 0.95, window.innerHeight *0.55];
  lineChartData: GemstoneExchangeDataDto | undefined;
  selectedButton: number = 7; //Number in days

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#e53935', '#1e88e5', '#608c26']
  };

  constructor(private luminiaApiService: LuminiaApiService, private snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
    try {
      var allGemstoneExchangeData$ = this.luminiaApiService.getAllGemstoneExchangeDataForLastDays(7);
      this.lineChartData = await firstValueFrom(allGemstoneExchangeData$);
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Gemstone Exchange data could not be loaded.",
        duration: 10000
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.view = [window.innerWidth * 0.95, window.innerHeight * 0.55];
  }

  dateFormatter(dayNumber: number): string {
    // If the day is not a integer number, give the entry no text
    if (Number.isInteger(dayNumber)){
      var months = ['Bloomen', 'Sumsun', 'Leaflet', 'Frizwa'];
      const year = Math.floor(dayNumber / 364);
      const monthIndex = Math.floor((dayNumber % 364) / 91);
      const dayInMonth = (dayNumber % 91) + 1;
      const monthName = months[monthIndex] || '???';
      return dayInMonth + " " + monthName + " " + year;
    }
    else return "";
  }

  async getGraphData(amountOfDays: number = 0) {
    try {
      var allGemstoneExchangeData$ = this.luminiaApiService.getAllGemstoneExchangeDataForLastDays(amountOfDays);
      this.lineChartData = await firstValueFrom(allGemstoneExchangeData$);
      this.selectedButton = amountOfDays;
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Gemstone Exchange data could not be loaded.",
        duration: 10000
      });
    }
  }
}
