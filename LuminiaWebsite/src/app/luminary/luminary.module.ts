import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LuminaryComponent } from './luminaries-page/luminary.component';
import { LuminaryButtonComponent } from './luminary-button/luminary-button.component';
import { MatCardModule } from '@angular/material/card';

const childRoutes: Routes = [
  {path:"luminaries", component: LuminaryComponent}
]

@NgModule({
  declarations: [
    LuminaryComponent,
    LuminaryButtonComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(childRoutes),
  ],
  exports: [
    LuminaryButtonComponent
  ],
})
export class LuminaryModule { }
