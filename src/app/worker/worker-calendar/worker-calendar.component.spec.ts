import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerCalendarComponent } from './worker-calendar.component';

describe('WorkerCalendarComponent', () => {
  let component: WorkerCalendarComponent;
  let fixture: ComponentFixture<WorkerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
