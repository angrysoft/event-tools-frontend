import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDayComponent } from './car-day.component';

describe('CarDayComponent', () => {
  let component: CarDayComponent;
  let fixture: ComponentFixture<CarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
