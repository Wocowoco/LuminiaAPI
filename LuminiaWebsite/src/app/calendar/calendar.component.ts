import { AfterViewInit, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { firstValueFrom } from 'rxjs';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ErrorSnackbarComponent } from '../snackbars/error-snackbar/error-snackbar.component';
import { CurrentDateDto } from '../services/luminia-api/dtos/currentDateDto.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  currentDayInYear : number = 0;
  currentSelectedQuarter : number = 0;
  headerText : string = '';
  currentDateDto : CurrentDateDto | any;

  constructor(private renderer: Renderer2,
              private elementRef : ElementRef,
              private luminiaApiService: LuminiaApiService,
              private snackBar: MatSnackBar) {

  }

  async ngOnInit(): Promise<void> {
    try {
      var currentDate$ = this.luminiaApiService.getCurrentDate();
      var currentDateDto = await firstValueFrom(currentDate$);

      this.currentDayInYear = currentDateDto.day;
      this.headerText = this.calculateHeaderText(currentDateDto.day, currentDateDto.year);
      this.showCurrentDay();
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Calendar data could not be loaded.",
        duration: 10000
      });
    }
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
