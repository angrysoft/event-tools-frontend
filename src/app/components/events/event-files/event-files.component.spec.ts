import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFilesComponent } from './event-files.component';

describe('EventFilesComponent', () => {
  let component: EventFilesComponent;
  let fixture: ComponentFixture<EventFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
