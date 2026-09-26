import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RarityCardComponent } from './rarity-card.component';

@NgModule({
  declarations: [
    RarityCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    RarityCardComponent
  ],
})
export class RarityCardModule { }
