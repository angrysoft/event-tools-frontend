import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReportViewComponent } from './event-report-view.component';

describe('EventReportViewComponent', () => {
  let component: EventReportViewComponent;
  let fixture: ComponentFixture<EventReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventReportViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
