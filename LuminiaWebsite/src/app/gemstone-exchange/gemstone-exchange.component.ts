import { Component, HostListener, OnInit } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-gemstone-exchange',
  templateUrl: './gemstone-exchange.component.html',
  styleUrls: ['./gemstone-exchange.component.css']
})
export class GemstoneExchangeComponent implements OnInit {

  legendPosition : LegendPosition = LegendPosition.Below;
  view: [number, number] = [window.innerWidth * 0.95, window.innerHeight *0.85];

  lineChartData = [
  {
    name: 'Ruby',
    series: [
      { name: 1, value: 10 },
      { name: 2, value: 15 },
      { name: 3, value: 25 },
    ]
  },
  {
    name: 'Sapphire',
    series: [
      { name: 1, value: 5 },
      { name: 2, value: 12 },
      { name: 3, value: 8 },
    ]
  },
  {
    name: 'Emerald',
    series: [
      { name: 1,  value: 4 },
      { name: 2,  value: 7 },
      { name: 3,  value: 13 },
    ]
  }
  ];

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#e53935', '#1e88e5', '#608c26']
  };
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:resize')
  onResize() {
    this.view = [window.innerWidth * 0.95, window.innerHeight * 0.85];
  }

  dateFormatter(dayNumber: number): string {
    var months = ['Bloomen', 'Sumsun', 'Leaflet', 'Frizwa'];
    const year = Math.floor(dayNumber / 364);
    const monthIndex = Math.floor((dayNumber % 364) / 91);
    const dayInMonth = (dayNumber % 91);
    const monthName = months[monthIndex] || '???';
    return dayInMonth + " " + monthName + " " + year;
  }
}
