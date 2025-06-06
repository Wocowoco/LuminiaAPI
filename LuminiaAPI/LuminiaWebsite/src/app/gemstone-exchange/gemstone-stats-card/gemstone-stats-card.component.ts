import { Component } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'gemstone-stats-card',
  templateUrl: './gemstone-stats-card.component.html',
  styleUrl: './gemstone-stats-card.component.css'
})
export class GemstoneStatsCardComponent {

  lineChartData = [
    {
      name: 'Gemstone Index',
      series: [
        { name: 0, value: 100 },
        { name: 1, value: 115 },
        { name: 2, value: 120 },
        { name: 3, value: 143 },
        { name: 4, value: 130 },
      ]
    }
  ];

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#e53935', '#1e88e5', '#608c26']
  };
}
