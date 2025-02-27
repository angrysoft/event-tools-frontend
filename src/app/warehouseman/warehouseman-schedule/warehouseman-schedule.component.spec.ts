import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemanScheduleComponent } from './warehouseman-schedule.component';

describe('WarehousemanScheduleComponent', () => {
  let component: WarehousemanScheduleComponent;
  let fixture: ComponentFixture<WarehousemanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousemanScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousemanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
