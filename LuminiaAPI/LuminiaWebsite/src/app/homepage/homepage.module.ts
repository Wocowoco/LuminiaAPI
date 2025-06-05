import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { RouterModule, Routes } from '@angular/router';

const childRoutes: Routes = [
  //{path:"", component: HomepageComponent}
  {path:"", redirectTo: '/map', pathMatch: 'full'}
]


@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
  ]
})
export class HomepageModule { }
