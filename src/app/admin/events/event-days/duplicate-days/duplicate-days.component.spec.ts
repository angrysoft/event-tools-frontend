import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDaysComponent } from './duplicate-days.component';

describe('DuplicateDaysComponent', () => {
  let component: DuplicateDaysComponent;
  let fixture: ComponentFixture<DuplicateDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
