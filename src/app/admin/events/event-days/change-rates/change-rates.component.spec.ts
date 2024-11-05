import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRatesComponent } from './change-rates.component';

describe('ChangeRatesComponent', () => {
  let component: ChangeRatesComponent;
  let fixture: ComponentFixture<ChangeRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
