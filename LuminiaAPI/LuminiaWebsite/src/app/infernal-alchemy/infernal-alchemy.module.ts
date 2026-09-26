import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfernalAlchemyComponent } from './infernal-alchemy.component';
import { ResearchTreeComponent } from './research-tree/research-tree.component';
import { PotionCardsComponent } from './research-tree/potion-cards.component';
import { PotionTextComponent } from './research-tree/potion-text.component';
import { RarityCardModule } from '../general/rarity-card/rarity-card.module';
import { RouterModule, Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

const childRoutes: Routes = [
  {path:"infernal-alchemy", component: InfernalAlchemyComponent }
]

@NgModule({
  declarations: [
    InfernalAlchemyComponent,
    ResearchTreeComponent,
    PotionCardsComponent,
    PotionTextComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
    MatGridListModule,
    MatTableModule,
    MatCardModule,
    RarityCardModule
  ]
})
export class InfernalAlchemyModule { }
