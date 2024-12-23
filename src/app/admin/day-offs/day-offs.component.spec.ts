import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffsComponent } from './day-offs.component';

describe('DayOffsComponent', () => {
  let component: DayOffsComponent;
  let fixture: ComponentFixture<DayOffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayOffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
