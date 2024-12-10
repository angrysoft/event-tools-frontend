import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerAddonsComponent } from './worker-addons.component';

describe('WorkerAddonsComponent', () => {
  let component: WorkerAddonsComponent;
  let fixture: ComponentFixture<WorkerAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerAddonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
