import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExecutionReportComponent } from './plan-execution-report.component';

describe('PlanExecutionReportComponent', () => {
  let component: PlanExecutionReportComponent;
  let fixture: ComponentFixture<PlanExecutionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanExecutionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanExecutionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
