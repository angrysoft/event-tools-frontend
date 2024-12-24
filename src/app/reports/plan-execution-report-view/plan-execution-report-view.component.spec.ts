import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExecutionReportViewComponent } from './plan-execution-report-view.component';

describe('PlanExecutionReportViewComponent', () => {
  let component: PlanExecutionReportViewComponent;
  let fixture: ComponentFixture<PlanExecutionReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanExecutionReportViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanExecutionReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
