import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefSettlementsComponent } from './chief-settlements.component';

describe('ChiefSettlementsComponent', () => {
  let component: ChiefSettlementsComponent;
  let fixture: ComponentFixture<ChiefSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChiefSettlementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiefSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
