import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerEventDayComponent } from './worker-event-day.component';

describe('EventDayComponent', () => {
  let component: WorkerEventDayComponent;
  let fixture: ComponentFixture<WorkerEventDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerEventDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerEventDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
