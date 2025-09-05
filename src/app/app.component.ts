import { Component } from '@angular/core';
import { SnowRootComponent } from './snow/snow-root.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    imports: [SnowRootComponent]
})
export class AppComponent {
  title = 'snowfall';
}
