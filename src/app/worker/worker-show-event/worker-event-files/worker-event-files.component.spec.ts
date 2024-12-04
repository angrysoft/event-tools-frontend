import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerEventFilesComponent } from './worker-event-files.component';

describe('WorkerEventFilesComponent', () => {
  let component: WorkerEventFilesComponent;
  let fixture: ComponentFixture<WorkerEventFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerEventFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerEventFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
