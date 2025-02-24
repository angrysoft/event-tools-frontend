import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDayDialogComponent } from './car-day-dialog.component';

describe('CarDayDialogComponent', () => {
  let component: CarDayDialogComponent;
  let fixture: ComponentFixture<CarDayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDayDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
