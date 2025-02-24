import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDayManageComponent } from './car-day-manage.component';

describe('CarDayManageComponent', () => {
  let component: CarDayManageComponent;
  let fixture: ComponentFixture<CarDayManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDayManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDayManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
