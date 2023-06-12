import { NgModule } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PantheonPageComponent } from './pantheon-page/pantheon-page.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';

const childRoutes: Routes = [
  {path:"pantheon", component: PantheonPageComponent }
]

@NgModule({
  declarations: [
    PantheonPageComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule.forChild(childRoutes),
  ]
})
export class PantheonModule { }
