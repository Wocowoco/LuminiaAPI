import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }

  formatDaynumberToString(dayNumber: number): string {
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
}
