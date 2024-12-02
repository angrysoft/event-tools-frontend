import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportDataComponent } from "./month-report-data.component";

describe("MonthReportDataComponent", () => {
  let component: ReportDataComponent;
  let fixture: ComponentFixture<ReportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
