import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfernalAlchemyComponent } from './infernal-alchemy.component';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

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
    MatGridListModule,
    MatTableModule,
    MatCardModule
  ]
})
export class InfernalAlchemyModule { }
