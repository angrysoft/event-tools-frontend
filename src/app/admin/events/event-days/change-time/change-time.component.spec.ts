import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTimeComponent } from './change-time.component';

describe('ChangeTimeComponent', () => {
  let component: ChangeTimeComponent;
  let fixture: ComponentFixture<ChangeTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
