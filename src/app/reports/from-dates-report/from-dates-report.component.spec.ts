import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDatesReportComponent } from './from-dates-report.component';

describe('FromDatesReportComponent', () => {
  let component: FromDatesReportComponent;
  let fixture: ComponentFixture<FromDatesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromDatesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDatesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
