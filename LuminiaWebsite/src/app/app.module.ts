import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapModule } from './map/map.module';
import { RouterModule, Routes } from '@angular/router';
import { HomepageModule } from './homepage/homepage.module';
import { ItemsModule } from './items/items.module';
import { HttpClientModule } from '@angular/common/http';
import { PantheonPageComponent } from './pantheon/pantheon-page/pantheon-page.component';
import { MatCardModule } from '@angular/material/card';
import { PantheonModule } from './pantheon/pantheon.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MapModule,
    HomepageModule,
    ItemsModule,
    BrowserModule,
    HttpClientModule,
    PantheonModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
