import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSettlementsComponent } from './manage-settlements.component';

describe('ManageSettlementsComponent', () => {
  let component: ManageSettlementsComponent;
  let fixture: ComponentFixture<ManageSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSettlementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
