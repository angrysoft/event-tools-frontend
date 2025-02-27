import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemanComponent } from './warehouseman.component';

describe('WarehousemanComponent', () => {
  let component: WarehousemanComponent;
  let fixture: ComponentFixture<WarehousemanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousemanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
