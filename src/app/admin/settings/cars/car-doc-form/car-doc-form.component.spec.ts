import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDocFormComponent } from './car-doc-form.component';

describe('CarDocFormComponent', () => {
  let component: CarDocFormComponent;
  let fixture: ComponentFixture<CarDocFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDocFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDocFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
