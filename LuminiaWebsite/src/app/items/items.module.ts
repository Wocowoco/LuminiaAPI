import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatExpansionModule} from '@angular/material/expansion';
import { ItemfilterComponent } from './itemfilter/itemfilter.component';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { FormsModule } from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

const childRoutes: Routes = [
  {path:"items", component: ItemsComponent}
]

@NgModule({
  declarations: [
    ItemsComponent,
    ItemfilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    RouterModule.forChild(childRoutes),
  ]
})
export class ItemsModule { }
