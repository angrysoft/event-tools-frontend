import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerShowEventComponent } from './worker-show-event.component';

describe('WorkerShowEventComponent', () => {
  let component: WorkerShowEventComponent;
  let fixture: ComponentFixture<WorkerShowEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerShowEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerShowEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
