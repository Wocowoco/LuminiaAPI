import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';
import { SecretModule } from '../general/secret/secret.module';

const routes: Routes = [
  {path: '404', component: NotFoundPageComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [
    NotFoundPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    SecretModule
  ]
})
export class NotFoundPageModule { }
