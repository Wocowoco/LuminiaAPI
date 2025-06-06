import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GemstoneExchangeComponent } from './gemstone-exchange.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { GemstoneStatsCardComponent } from './gemstone-stats-card/gemstone-stats-card.component';
import { MatCardModule } from '@angular/material/card';

const childRoutes: Routes = [
  {path:"gemstone-exchange", component: GemstoneExchangeComponent }
]

@NgModule({
  declarations: [
    GemstoneExchangeComponent,
    GemstoneStatsCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forChild(childRoutes),
    NgxChartsModule,
]
})
export class GemstoneExchangeModule { }
