import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LuminaryComponent } from './luminaries-page/luminary.component';
import { LuminaryButtonComponent } from './luminary-button/luminary-button.component';
import { MatButtonModule } from '@angular/material/button';
import { SwirlingMoonPageComponent } from './swirling-moon-page/swirling-moon-page.component';
import { SpellInfoBlockModule } from '../general/spell-info-block/spell-info-block.module';
import { AugmentRuneCardComponent } from './augment-rune-card/augment-rune-card.component';
import { MatCardModule } from '@angular/material/card';

const childRoutes: Routes = [
  {path:"luminaries", component: LuminaryComponent},
  {path:"luminaries/swirling-moon", component: SwirlingMoonPageComponent}
]

@NgModule({
  declarations: [
    LuminaryComponent,
    LuminaryButtonComponent,
    SwirlingMoonPageComponent,
    AugmentRuneCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    SpellInfoBlockModule,
    RouterModule.forChild(childRoutes),
  ],
  exports: [
    LuminaryButtonComponent
  ],
})
export class LuminaryModule { }
