import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GemstoneExchangeComponent } from './gemstone-exchange.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';

const childRoutes: Routes = [
  {path:"gemstone-exchange", component: GemstoneExchangeComponent }
]

@NgModule({
  declarations: [
    GemstoneExchangeComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule.forChild(childRoutes),
    NgxChartsModule
  ]
})
export class GemstoneExchangeModule { }
