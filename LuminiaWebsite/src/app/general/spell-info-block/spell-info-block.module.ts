import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpellInfoBlockComponent } from './spell-info-block.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    SpellInfoBlockComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    SpellInfoBlockComponent
  ],
})
export class SpellInfoBlockModule { }
