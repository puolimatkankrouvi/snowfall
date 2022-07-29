import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SnowModule } from 'src/app/snow/snow.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SnowModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
