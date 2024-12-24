import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersReportComponent } from './workers-report.component';

describe('WorkersReportComponent', () => {
  let component: WorkersReportComponent;
  let fixture: ComponentFixture<WorkersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
