import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDocsComponent } from './worker-docs.component';

describe('WorkerDocsComponent', () => {
  let component: WorkerDocsComponent;
  let fixture: ComponentFixture<WorkerDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
