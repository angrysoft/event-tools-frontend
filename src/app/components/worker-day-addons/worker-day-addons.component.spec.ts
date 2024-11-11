import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDayAddonsComponent } from './worker-day-addons.component';

describe('WorkerDayAddonsComponent', () => {
  let component: WorkerDayAddonsComponent;
  let fixture: ComponentFixture<WorkerDayAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDayAddonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDayAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
