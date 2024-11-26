import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthReportDataComponent } from './month-report-data.component';

describe('MonthReportDataComponent', () => {
  let component: MonthReportDataComponent;
  let fixture: ComponentFixture<MonthReportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthReportDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthReportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
