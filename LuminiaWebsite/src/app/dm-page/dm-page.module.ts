import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmPageComponent } from './dm-page.component';
import { RouterModule, Routes } from '@angular/router';
import { DmCheckGuard } from '../guards/dm-check/dm-check.guard';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
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
