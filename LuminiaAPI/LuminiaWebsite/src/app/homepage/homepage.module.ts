import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineCardComponent } from './timeline/timeline-card/timeline-card.component';

const childRoutes: Routes = [
  {path:"", component: HomepageComponent, pathMatch: 'full'}
]


@NgModule({
  declarations: [
    HomepageComponent,
    TimelineComponent,
    TimelineCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
  ]
})
export class HomepageModule { }
