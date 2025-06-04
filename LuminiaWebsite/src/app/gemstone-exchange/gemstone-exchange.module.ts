import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GemstoneExchangeComponent } from './gemstone-exchange.component';

const childRoutes: Routes = [
  {path:"gemstone-exchange", component: GemstoneExchangeComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
  ]
})
export class GemstoneExchangeModule { }
