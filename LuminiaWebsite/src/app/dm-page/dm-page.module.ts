import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmPageComponent } from './dm-page.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';
import { DmCheckGuard } from '../guards/dm-check/dm-check.guard';

const routes: Routes = [
  { path:"dm/:dmCode", component: DmPageComponent, canActivate: [DmCheckGuard]}
]

@NgModule({
  declarations: [
    DmPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ]
})
export class DmPageModule { }
