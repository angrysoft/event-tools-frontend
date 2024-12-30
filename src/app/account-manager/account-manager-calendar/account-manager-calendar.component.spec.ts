import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerCalendarComponent } from './account-manager-calendar.component';

describe('AccountManagerCalendarComponent', () => {
  let component: AccountManagerCalendarComponent;
  let fixture: ComponentFixture<AccountManagerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagerCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
