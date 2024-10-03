import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonValueFormComponent } from './addon-value-form.component';

describe('AddonValueFormComponent', () => {
  let component: AddonValueFormComponent;
  let fixture: ComponentFixture<AddonValueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonValueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
