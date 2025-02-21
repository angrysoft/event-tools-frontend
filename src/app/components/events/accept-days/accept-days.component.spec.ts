import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptDaysComponent } from './accept-days.component';

describe('AcceptDaysComponent', () => {
  let component: AcceptDaysComponent;
  let fixture: ComponentFixture<AcceptDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
