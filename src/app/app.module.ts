import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './snow/canvas/canvas.component';
import { SnowSettingsComponent } from './snow/snow-settings/snow-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    SnowSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
