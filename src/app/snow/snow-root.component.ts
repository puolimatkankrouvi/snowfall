import { Component } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import { SnowSettingsComponent } from './snow-settings/snow-settings.component';

@Component({
    selector: 'snow-root',
    templateUrl: './snow-root.component.html',
    standalone: true,
    imports: [CanvasComponent, SnowSettingsComponent]
})
export class SnowRootComponent {}
