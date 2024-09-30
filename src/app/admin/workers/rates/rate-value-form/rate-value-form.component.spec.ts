import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateValueFormComponent } from './rate-value-form.component';

describe('RateValueFormComponent', () => {
  let component: RateValueFormComponent;
  let fixture: ComponentFixture<RateValueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateValueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
