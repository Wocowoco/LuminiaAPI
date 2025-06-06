import { Component, Input } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { GemstoneExchangeDataDto } from 'src/app/services/luminia-api/dtos/gemstoneExchangeData.interface';

@Component({
  selector: 'gemstone-stats-card',
  templateUrl: './gemstone-stats-card.component.html',
  styleUrl: './gemstone-stats-card.component.css'
})
export class GemstoneStatsCardComponent {

  @Input() color: string = '#000000';
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

  name: string = 'Gemstone';
  currentPrice: number = 0.0;

  compareYesterday: string = '0.0 (00.00%)';
  compareWeek: string = '0.0 (00.00%)';
  compareQuarter: string = '0.0 (00.00%)';
  compareYear: string = '0.0 (00.00%)';
  compareFiveYear: string = '0.0 (00.00%)';
  compareTenYear: string = '0.0 (00.00%)';



  colorScheme = {
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [this.color]
  };

  ngOnChanges() {
    this.colorScheme = {
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [this.color]
    };
  };
}
