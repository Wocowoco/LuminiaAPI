import { AfterViewInit, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  currentDayInYear : number = 138;
  currentYear : number = 7346;
  currentSelectedQuarter : number = 0;
  headerText : string = '';

  constructor(private renderer: Renderer2, private elementRef : ElementRef) { }
  ngOnInit(): void {
    this.headerText = this.calculateHeaderText(this.currentDayInYear, this.currentYear);
  }

  ngAfterViewInit(): void {
    this.showCurrentDay();
  }

  clickedBloomen() : void {
    this.currentSelectedQuarter = 1;
    this.showCurrentDay();
  }

  clickedSumsun() : void {
    this.currentSelectedQuarter = 2;
    this.showCurrentDay();
  }

  clickedLeaflet() : void {
    this.currentSelectedQuarter = 3;
    this.showCurrentDay();
  }

  clickedFrizwa() : void {
    this.currentSelectedQuarter = 4;
    this.showCurrentDay();
  }

  showCurrentDay()
  {
    setTimeout(() => {
      console.log('Update');
      const currentDay = this.elementRef.nativeElement.querySelector('#day'+ this.currentDayInYear);
      if (currentDay) {
        this.renderer.addClass(currentDay, 'current-day');
      }
    });
  }

  calculateHeaderText(dayInYear : number, year : number) : string {

    var dayInMonth: number;
    var daySuffix: string;
    var monthText: string;

    switch (Math.floor((dayInYear - 1) / 91)) {
      case 0:
        monthText = 'Bloomen';
        this.currentSelectedQuarter = 1;
        dayInMonth = dayInYear;
        break;
      case 1:
        monthText = 'Sumsun';
        this.currentSelectedQuarter = 2;
        dayInMonth = dayInYear - 91;
        break;
      case 2:
        monthText = 'Leaflet';
        this.currentSelectedQuarter = 3;
        dayInMonth = dayInYear - 182;
        break;
      case 3:
        monthText = 'Frizwa';
        this.currentSelectedQuarter = 4;
        dayInMonth = dayInYear - 273;
        break;
      default:
        monthText = '???';
        dayInMonth = 0;
        break;
    }

    if (dayInMonth % 10 == 1 && dayInMonth != 11)
    {
      daySuffix = "st";
    }
    else if (dayInMonth % 10 == 2 && dayInMonth != 12)
    {
      daySuffix = "nd";
    }
    else if (dayInMonth % 10 == 3 && dayInMonth != 13)
    {
      daySuffix = "rd"
    }
    else {
      daySuffix = "th";
    }

    return dayInMonth.toString() + daySuffix + " of " + monthText + " " + year;
  }
}
