import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFileFormComponent } from './event-file-form.component';

describe('EventFileFormComponent', () => {
  let component: EventFileFormComponent;
  let fixture: ComponentFixture<EventFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFileFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
