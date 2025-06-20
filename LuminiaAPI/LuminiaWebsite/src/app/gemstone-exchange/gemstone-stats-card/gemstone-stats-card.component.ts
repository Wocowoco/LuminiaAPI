import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScaleType } from '@swimlane/ngx-charts';
import { firstValueFrom } from 'rxjs';
import { DateFormatterService } from 'src/app/helpers/date-formatter.service';
import { GemstoneExchangeDataDto } from 'src/app/services/luminia-api/dtos/gemstoneExchangeData.interface';
import { Gemstone } from 'src/app/services/luminia-api/enums/gemstone.enum';
import { LuminiaApiService } from 'src/app/services/luminia-api/luminia-api.service';
import { ErrorSnackbarComponent } from 'src/app/snackbars/error-snackbar/error-snackbar.component';

@Component({
  selector: 'gemstone-stats-card',
  templateUrl: './gemstone-stats-card.component.html',
  styleUrl: './gemstone-stats-card.component.css'
})
export class GemstoneStatsCardComponent {

  @Input() color: string = '#000000';
  @Input() priceHistory: GemstoneExchangeDataDto = {name: 'Placeholder', series: []};
  @Input() graphData: GemstoneExchangeDataDto[] =
    [{
      name: 'Placeholder',
      series: [
        { name: 0, value: 0 },
        { name: 1, value: 0 },
        { name: 2, value: 0 },
        { name: 3, value: 0 },
        { name: 4, value: 0 },
        { name: 5, value: 0 },
        { name: 6, value: 0 },
      ]
    }];

  selectedButton: number = -1;
  name: string = 'Gemstone';
  currentPrice: number = 0.0;
  gemstoneId: number = 0;

  differenceYesterday: string = '0.0';
  differenceWeek: string = '0.0';
  differenceQuarter: string = '0.0';
  differenceYear: string = '0.0';
  differenceFiveYear: string = '0.0';
  differenceTenYear: string = '0.0';

  percentageYesterday: number = 0.0;
  percentageWeek: number = 0.0;
  percentageQuarter: number = 0.0;
  percentageYear: number = 0.0;
  percentageFiveYear: number = 0.0;
  percentageTenYear: number = 0.0;

  colorScheme = {
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [this.color]
  };

  formatDate: (dayNumber: number) => string;

  constructor(
    private luminiaApiService: LuminiaApiService,
    private snackBar: MatSnackBar,
    private dateFormatterService: DateFormatterService) {
      this.formatDate = (dayNumber: number) => this.dateFormatterService.formatDaynumberToString(dayNumber);
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['color']) {
      this.colorScheme = {
      name: 'colorScheme',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: [this.color]
      };
    };

    if(changes['graphData']) {
      this.gemstoneId = Number(this.graphData[0].name);
      this.selectedButton = this.graphData[0].series.length;
    }

    if (changes['priceHistory']) {
      this.name = Gemstone[this.priceHistory.name as keyof typeof Gemstone].toString();
      this.currentPrice = this.priceHistory.series[6].value;
      this.differenceYesterday = this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[5].value);
      this.differenceWeek =      this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[4].value);
      this.differenceQuarter =   this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[3].value);
      this.differenceYear =      this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[2].value);
      this.differenceFiveYear =  this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[1].value);
      this.differenceTenYear =   this.calculatePriceDifference(this.currentPrice, this.priceHistory.series[0].value);
      this.percentageYesterday = this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[5].value);
      this.percentageWeek =      this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[4].value);
      this.percentageQuarter =   this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[3].value);
      this.percentageYear =      this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[2].value);
      this.percentageFiveYear =  this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[1].value);
      this.percentageTenYear =   this.calculatePercentageDifference(this.currentPrice, this.priceHistory.series[0].value)
    }
  };

  calculatePriceDifference(currentPrice: number, oldPrice: number): string {
    var pricediff = (currentPrice - oldPrice);

    if (pricediff > 0) {
      return '+' + pricediff.toFixed(1);
    }

    return pricediff.toFixed(1);
  }

  calculatePercentageDifference(currentPrice: number, oldPrice: number): number {
    return ((currentPrice - oldPrice) / oldPrice) * 100;
  }

  getPercentageClass(percentage: number): string {
    if (percentage > 25) {
      return 'percent-positive-3';
    }
    else if (percentage > 5) {
      return 'percent-positive-2';
    }
    else if (percentage > 0) {
      return 'percent-positive-1';
    }
    else if (percentage == 0) {
      return 'percent-neutral';
    }
    else if (percentage > -5) {
      return 'percent-negative-1';
    }
    else if (percentage > -25) {
      return 'percent-negative-2';
    }
    else {
      return 'percent-negative-3';
    }
  }

  getCardColorByPercentage(percentage: number) : string {
    if (percentage > 0)
    {
      return 'card-positive';
    }
    else if (percentage == 0) {
      return 'card-neutral'
    }
    else {
      return 'card-negative';
    }
  }

  async getGraphData(amountOfDays: number = 0) {
    try {
      var allGemstoneExchangeData$ = this.luminiaApiService.getGemstoneExchangeDataForLastDays(amountOfDays, this.gemstoneId);
      this.graphData = await firstValueFrom(allGemstoneExchangeData$);
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
