import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDaysComponent } from './event-days.component';

describe('EventDaysComponent', () => {
  let component: EventDaysComponent;
  let fixture: ComponentFixture<EventDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
