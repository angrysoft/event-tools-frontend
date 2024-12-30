import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerScheduleComponent } from './account-manager-schedule.component';

describe('AccountManagerScheduleComponent', () => {
  let component: AccountManagerScheduleComponent;
  let fixture: ComponentFixture<AccountManagerScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountManagerScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
