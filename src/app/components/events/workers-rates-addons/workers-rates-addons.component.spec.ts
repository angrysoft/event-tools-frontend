import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersRatesAddonsComponent } from './workers-rates-addons.component';

describe('WorkersRatesAddonsComponent', () => {
  let component: WorkersRatesAddonsComponent;
  let fixture: ComponentFixture<WorkersRatesAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersRatesAddonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersRatesAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
