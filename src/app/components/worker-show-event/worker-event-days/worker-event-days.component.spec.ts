import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerEventDaysComponent } from './worker-event-days.component';

describe('WorkerEventDaysComponent', () => {
  let component: WorkerEventDaysComponent;
  let fixture: ComponentFixture<WorkerEventDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerEventDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerEventDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
