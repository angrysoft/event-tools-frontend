import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerFilterComponent } from './worker-filter.component';

describe('WorkerFilterComponent', () => {
  let component: WorkerFilterComponent;
  let fixture: ComponentFixture<WorkerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
