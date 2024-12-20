import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffToAcceptComponent } from './day-off-to-accept.component';

describe('DayOffToAcceptComponent', () => {
  let component: DayOffToAcceptComponent;
  let fixture: ComponentFixture<DayOffToAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayOffToAcceptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayOffToAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
