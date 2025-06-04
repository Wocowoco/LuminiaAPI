import { NgModule } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PantheonPageComponent } from './pantheon-page/pantheon-page.component';
import { MatLegacyCard as MatCard, MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
