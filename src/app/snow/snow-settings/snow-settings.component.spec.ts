import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnowSettingsComponent } from './snow-settings.component';

describe('SnowSettingsComponent', () => {
  let component: SnowSettingsComponent;
  let fixture: ComponentFixture<SnowSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnowSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnowSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
