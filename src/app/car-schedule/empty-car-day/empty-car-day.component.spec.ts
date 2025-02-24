import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCarDayComponent } from './empty-car-day.component';

describe('EmptyCarDayComponent', () => {
  let component: EmptyCarDayComponent;
  let fixture: ComponentFixture<EmptyCarDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCarDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyCarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
