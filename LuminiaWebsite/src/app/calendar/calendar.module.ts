import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

const childRoutes: Routes = [
  {path:"calendar", component: CalendarComponent }
]


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(childRoutes),
    MatGridListModule
  ]
})
export class CalendarModule { }
