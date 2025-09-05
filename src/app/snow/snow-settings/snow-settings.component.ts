import { Component, inject } from '@angular/core';
import { SnowService } from 'src/app/snow/snow.service';

@Component({
    selector: 'snow-settings',
    templateUrl: './snow-settings.component.html',
    styleUrls: ['./snow-settings.component.less'],
    standalone: true
})
export class SnowSettingsComponent {
  private readonly snowService: SnowService = inject(SnowService);

  get density() {
    return this.snowService.density;
  }

  setDensity(event: any) {
    this.snowService.setDensity(event.target.value);
  }
}
