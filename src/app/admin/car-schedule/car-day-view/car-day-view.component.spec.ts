import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDayViewComponent } from './car-day-view.component';

describe('CarDayViewComponent', () => {
  let component: CarDayViewComponent;
  let fixture: ComponentFixture<CarDayViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDayViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
