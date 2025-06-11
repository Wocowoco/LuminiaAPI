import { AfterViewInit, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../snackbars/error-snackbar/error-snackbar.component';
import { CurrentDateDto } from '../services/luminia-api/dtos/currentDateDto.interface';
import { DateFormatterService } from '../helpers/date-formatter.service';

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
  isLoading : boolean = true;


  constructor(private renderer: Renderer2,
              private elementRef : ElementRef,
              private luminiaApiService: LuminiaApiService,
              private snackBar: MatSnackBar,
              private dateFormatterService: DateFormatterService ) {

  }

  async ngOnInit(): Promise<void> {
    try {
      var currentDate$ = this.luminiaApiService.getCurrentDate();
      this.currentDateDto = await firstValueFrom(currentDate$);

      this.headerText = this.dateFormatterService.formatDaynumberToString(this.currentDateDto.dayNumber);
      this.currentDayInYear = Math.floor(this.currentDateDto.dayNumber % 364 + 1);
      this.setCurrentQuarter(this.currentDayInYear);
      this.showCurrentDay();
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Current day could not be loaded.",
        duration: 10000
      });
      this.headerText = "Calendar";
      this.currentSelectedQuarter = 1;
    } finally {
    this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
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

  setCurrentQuarter(dayNumber: number) {
    switch (Math.floor((dayNumber - 1) / 91)) {
      case 0:
        this.currentSelectedQuarter = 1;
        break;
      case 1:
        this.currentSelectedQuarter = 2;
        break;
      case 2:
        this.currentSelectedQuarter = 3;
        break;
      case 3:
        this.currentSelectedQuarter = 4;
        break;
      default:
        break;
    }
  }
}
