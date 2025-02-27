import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerRatesComponent } from './worker-rates.component';

describe('WorkerRatesComponent', () => {
  let component: WorkerRatesComponent;
  let fixture: ComponentFixture<WorkerRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
