import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GemstoneExchangeComponent } from './gemstone-exchange.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const childRoutes: Routes = [
  {path:"gemstone-exchange", component: GemstoneExchangeComponent }
]

@NgModule({
  declarations: [
    GemstoneExchangeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    NgxChartsModule
  ]
})
export class GemstoneExchangeModule { }
