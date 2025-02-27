import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemanCalendarComponent } from './warehouseman-calendar.component';

describe('WarehousemanCalendarComponent', () => {
  let component: WarehousemanCalendarComponent;
  let fixture: ComponentFixture<WarehousemanCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousemanCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousemanCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
