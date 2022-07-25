import { Component } from '@angular/core';
import { SnowService } from 'src/app/snow.service';

@Component({
  selector: 'app-snow-settings',
  templateUrl: './snow-settings.component.html',
  styleUrls: ['./snow-settings.component.less']
})
export class SnowSettingsComponent {
  constructor(private snowService: SnowService) {}

  get density() {
    return this.snowService.density;
  }

  setDensity(event: any) {
    this.snowService.setDensity(event.target.value);
  }
}
