import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CanvasComponent } from "src/app/snow/canvas/canvas.component";
import { SnowSettingsComponent } from "src/app/snow/snow-settings/snow-settings.component";
import { SnowService } from "src/app/snow/snow.service";
import { SnowRootComponent } from './snow-root.component';

@NgModule({
  declarations: [
    SnowRootComponent,
    CanvasComponent,
    SnowSettingsComponent,
  ],
  imports: [CommonModule],
  providers: [SnowService],
  exports: [SnowRootComponent]
})
export class SnowModule {}
