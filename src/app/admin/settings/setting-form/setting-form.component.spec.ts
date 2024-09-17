import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingFormComponent } from './setting-form.component';

describe('SettingFormComponent', () => {
  let component: SettingFormComponent;
  let fixture: ComponentFixture<SettingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
