import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDatesReportViewComponent } from './from-dates-report-view.component';

describe('FromDatesReportViewComponent', () => {
  let component: FromDatesReportViewComponent;
  let fixture: ComponentFixture<FromDatesReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromDatesReportViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDatesReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
