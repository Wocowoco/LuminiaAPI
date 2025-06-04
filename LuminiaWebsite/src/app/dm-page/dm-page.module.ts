import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmPageComponent } from './dm-page.component';
import { RouterModule, Routes } from '@angular/router';
import { DmCheckGuard } from '../guards/dm-check/dm-check.guard';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path:"dm/:dmCode", component: DmPageComponent, canActivate: [DmCheckGuard]}
]

@NgModule({
  declarations: [
    DmPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class DmPageModule { }
