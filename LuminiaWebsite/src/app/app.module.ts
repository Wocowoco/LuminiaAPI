import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapModule } from './map/map.module';
import { HomepageModule } from './homepage/homepage.module';
import { ItemsModule } from './items/items.module';
import { HttpClientModule } from '@angular/common/http';
import { PantheonModule } from './pantheon/pantheon.module';
import { CommonModule } from '@angular/common';
import { InfernalAlchemyModule } from './infernal-alchemy/infernal-alchemy.module';
import { CalendarModule } from './calendar/calendar.module';
import { NotFoundPageModule } from './not-found-page/not-found-page.module';
import { DmPageModule } from './dm-page/dm-page.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MapModule,
    HomepageModule,
    ItemsModule,
    BrowserModule,
    HttpClientModule,
    PantheonModule,
    InfernalAlchemyModule,
    CalendarModule,
    DmPageModule,
    NotFoundPageModule, //This module needs to be the last import because of the wildcard route
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
