import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersReportViewComponent } from './workers-report-view.component';

describe('WorkersReportViewComponent', () => {
  let component: WorkersReportViewComponent;
  let fixture: ComponentFixture<WorkersReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersReportViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
