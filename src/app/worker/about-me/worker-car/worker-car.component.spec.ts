import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerCarComponent } from './worker-car.component';

describe('WorkerCarComponent', () => {
  let component: WorkerCarComponent;
  let fixture: ComponentFixture<WorkerCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerCarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
