import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangerComponent } from './date-changer.component';

describe('DateChangerComponent', () => {
  let component: DateChangerComponent;
  let fixture: ComponentFixture<DateChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateChangerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
