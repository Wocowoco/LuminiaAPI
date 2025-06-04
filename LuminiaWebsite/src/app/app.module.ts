import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapModule } from './map/map.module';
import { HomepageModule } from './homepage/homepage.module';
import { ItemsModule } from './items/items.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PantheonModule } from './pantheon/pantheon.module';
import { CommonModule } from '@angular/common';
import { InfernalAlchemyModule } from './infernal-alchemy/infernal-alchemy.module';
import { CalendarModule } from './calendar/calendar.module';
import { NotFoundPageModule } from './not-found-page/not-found-page.module';
import { DmPageModule } from './dm-page/dm-page.module';
import { LuminaryModule } from './luminary/luminary.module';
import { SpellInfoBlockModule } from './general/spell-info-block/spell-info-block.module';
import { GemstoneExchangeModule } from './gemstone-exchange/gemstone-exchange.module';

@NgModule({
  declarations: [
        AppComponent,
        NavbarComponent,
    ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MapModule,
    HomepageModule,
    ItemsModule,
    BrowserModule,
    PantheonModule,
    InfernalAlchemyModule,
    CalendarModule,
    DmPageModule,
    LuminaryModule,
    SpellInfoBlockModule,
    GemstoneExchangeModule,
    NotFoundPageModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
