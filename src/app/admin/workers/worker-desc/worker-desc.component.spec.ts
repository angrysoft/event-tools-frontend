import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDescComponent } from './worker-desc.component';

describe('WorkerDescComponent', () => {
  let component: WorkerDescComponent;
  let fixture: ComponentFixture<WorkerDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDescComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
