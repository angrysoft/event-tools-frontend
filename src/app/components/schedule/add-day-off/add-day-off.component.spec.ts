import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDayOffComponent } from './add-day-off.component';

describe('AddDayOffComponent', () => {
  let component: AddDayOffComponent;
  let fixture: ComponentFixture<AddDayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDayOffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
