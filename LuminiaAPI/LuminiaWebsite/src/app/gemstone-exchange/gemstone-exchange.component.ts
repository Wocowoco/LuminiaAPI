import { Component, HostListener, OnInit } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { GemstoneExchangeDataDto } from '../services/luminia-api/dtos/gemstoneExchangeData.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ErrorSnackbarComponent } from '../snackbars/error-snackbar/error-snackbar.component';
import { Gemstone } from '../services/luminia-api/enums/gemstone.enum';
import { DateFormatterService } from '../helpers/date-formatter.service';

@Component({
  selector: 'app-gemstone-exchange',
  templateUrl: './gemstone-exchange.component.html',
  styleUrls: ['./gemstone-exchange.component.css']
})
export class GemstoneExchangeComponent implements OnInit {

  legendPosition : LegendPosition = LegendPosition.Below;
  view: [number, number] = [window.innerWidth * 0.95, window.innerHeight *0.55];
  lineChartData: GemstoneExchangeDataDto[] = [];
  priceHistoryData: GemstoneExchangeDataDto[] = [];
  weekLineChartData: GemstoneExchangeDataDto[] = [];
  selectedButton: number = -1;
  isLoading: boolean = true;
  hasError: boolean = false;
  colors: string[] = ['#e53935', '#242fc9', '#608c26', '#ebb134', '#5cafdb', '#7714a8', '#2e2e2e', '#d9611c']
  formatDate: (dayNumber: number) => string;

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.colors
  };

  gemstoneStatCards: { color: string; graphData: GemstoneExchangeDataDto[], priceHistory: GemstoneExchangeDataDto}[] = [];

  constructor(
    private luminiaApiService: LuminiaApiService,
    private snackBar: MatSnackBar,
    private dateFormatterService: DateFormatterService) {
      this.formatDate = (dayNumber: number) => this.dateFormatterService.formatDaynumberToString(dayNumber);
    }

  async ngOnInit(): Promise<void> {
    await this.getGraphData(92, true, true);
    await this.getPriceHistory();
    await this.initializeGemstoneStats();
    this.isLoading = false;
  }



  @HostListener('window:resize')
  onResize() {
    this.view = [window.innerWidth * 0.95, window.innerHeight * 0.55];
  }

  async getGraphData(amountOfDays: number = 0, saveForGemstoneStats: boolean = false, setHasError: boolean = false) {
    try {
      var allGemstoneExchangeData$ = this.luminiaApiService.getAllGemstoneExchangeDataForLastDays(amountOfDays);
      this.lineChartData = await firstValueFrom(allGemstoneExchangeData$);

      if (saveForGemstoneStats) {
        this.weekLineChartData = structuredClone(this.lineChartData);
      }

      // Order them by GemstoneId
      this.lineChartData.sort((a, b) => Number(a.name) - Number(b.name));
      // Convert enum value to string
      this.lineChartData.forEach(gemstone => {
        gemstone.name = Gemstone[gemstone.name as keyof typeof Gemstone].toString();
      });

      this.selectedButton = amountOfDays;
    } catch {
      this.showLoadError(setHasError);
    }
  }

   async getPriceHistory() {
    try {
      var priceHistory$ = this.luminiaApiService.getAllGemstoneExchangeDataHistory();
      this.priceHistoryData = await firstValueFrom(priceHistory$);

    } catch {
      this.showLoadError();
    }
  }

  async initializeGemstoneStats() {
    // Order them by value (high to low)
    this.weekLineChartData.sort((a, b) => Number(b.series[a.series.length-1].value) - Number(a.series[b.series.length-1].value));

    this.weekLineChartData.forEach(gemstone => {
      // Set gemstone graph data
      const gemstoneDtoArr: GemstoneExchangeDataDto[] = [];
      gemstoneDtoArr.push(gemstone);

      // Assign colors to the gemstone stat cards
      const color = this.colors[Number(gemstone.name) - 1];

      // Set price history
      const priceHistory = this.priceHistoryData.find(x => x.name === gemstone.name);
      if (!priceHistory) {
        return; // If no price history is found, skip this gemstone
      }

      this.gemstoneStatCards.push({
        color: color,
        graphData: gemstoneDtoArr,
        priceHistory: priceHistory
      });
    });
  };

  showLoadError(setHasError: boolean = false){
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          panelClass: 'error-snackbar',
          data: "Gemstone Exchange data could not be loaded.",
          duration: 10000
    });

    if(setHasError){
      this.hasError = true;
      this.isLoading = false;
    }
  };
}
