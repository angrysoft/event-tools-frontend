import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDescFormComponent } from './worker-desc-form.component';

describe('WorkerDescFormComponent', () => {
  let component: WorkerDescFormComponent;
  let fixture: ComponentFixture<WorkerDescFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDescFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDescFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
