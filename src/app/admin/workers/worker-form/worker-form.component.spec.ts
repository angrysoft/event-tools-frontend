import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerFormComponent } from './worker-form.component';

describe('WorkerFormComponent', () => {
  let component: WorkerFormComponent;
  let fixture: ComponentFixture<WorkerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
