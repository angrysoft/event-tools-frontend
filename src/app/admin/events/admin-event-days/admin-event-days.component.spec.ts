import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventDaysComponent } from './admin-event-days.component';

describe('AdminEventDaysComponent', () => {
  let component: AdminEventDaysComponent;
  let fixture: ComponentFixture<AdminEventDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
