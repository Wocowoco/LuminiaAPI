import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  currentQuarter : number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  clickedBloomen() : void {
    this.currentQuarter = 1;
  }

  clickedSumsun() : void {
    this.currentQuarter = 2;
  }

  clickedLeaflet() : void {
    this.currentQuarter = 3;
  }

  clickedFrizwa() : void {
    this.currentQuarter = 4;
  }

}
