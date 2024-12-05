import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSettlementsComponent } from './common-settlements.component';

describe('CommonSettlementsComponent', () => {
  let component: CommonSettlementsComponent;
  let fixture: ComponentFixture<CommonSettlementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSettlementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
