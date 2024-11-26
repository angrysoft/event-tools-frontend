import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthReportWorkerInfoComponent } from './month-report-worker-info.component';

describe('MonthReportWorkerInfoComponent', () => {
  let component: MonthReportWorkerInfoComponent;
  let fixture: ComponentFixture<MonthReportWorkerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthReportWorkerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthReportWorkerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
