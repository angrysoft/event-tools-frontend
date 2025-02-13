import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangerRangeComponent } from './date-changer-range.component';

describe('DateChangerRangeComponent', () => {
  let component: DateChangerRangeComponent;
  let fixture: ComponentFixture<DateChangerRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateChangerRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateChangerRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
