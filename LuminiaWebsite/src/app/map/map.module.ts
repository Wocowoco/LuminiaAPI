import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldmapComponent } from './worldmap/worldmap.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DmCheckGuard } from '../guards/dm-check/dm-check.guard';

const childRoutes: Routes = [
  {path:"map", component: WorldmapComponent},
  {path:"map/:dmCode", component: WorldmapComponent, canActivate: [DmCheckGuard]}
]

@NgModule({
  declarations: [
    WorldmapComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild(childRoutes),
  ],
  exports:[
    WorldmapComponent
  ]
})
export class MapModule { }
