import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { ItemfilterComponent } from './itemfilter/itemfilter.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

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
