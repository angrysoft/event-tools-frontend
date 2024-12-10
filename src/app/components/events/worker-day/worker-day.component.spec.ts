import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDayComponent } from './worker-day.component';

describe('WorkerDayComponent', () => {
  let component: WorkerDayComponent;
  let fixture: ComponentFixture<WorkerDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
