import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class CalendarModule { }
