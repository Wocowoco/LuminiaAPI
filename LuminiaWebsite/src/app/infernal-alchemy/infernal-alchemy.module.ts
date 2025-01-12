import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfernalAlchemyComponent } from './infernal-alchemy.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

const childRoutes: Routes = [
  {path:"infernal-alchemy", component: InfernalAlchemyComponent }
]

@NgModule({
  declarations: [
    InfernalAlchemyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    MatGridListModule
  ]
})
export class InfernalAlchemyModule { }
